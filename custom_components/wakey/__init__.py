"""The Wakey integration — an alarm clock for Home Assistant."""

from __future__ import annotations

import logging
from dataclasses import dataclass

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import (
    ATTR_ALARM_ID,
    DOMAIN,
    PLATFORMS,
    REPEAT_MODES,
    SIGNAL_ALARM_REMOVED,
    SOURCE_KINDS,
)
from .panel import async_register_panel, async_unregister_panel
from .player import WakeyPlayer
from .scheduler import WakeyScheduler
from .store import WakeyStore
from .websocket import async_register as async_register_websocket

_LOGGER = logging.getLogger(__name__)

SERVICE_CREATE = "create"
SERVICE_UPDATE = "update"
SERVICE_DELETE = "delete"
SERVICE_SNOOZE = "snooze"
SERVICE_DISMISS = "dismiss"
SERVICE_SKIP_NEXT = "skip_next"
SERVICE_TRIGGER_NOW = "trigger_now"

# Fields shared by create and update. Everything except the identity of the
# alarm is optional so update can be a partial patch.
_ALARM_FIELDS = {
    vol.Optional("name"): cv.string,
    vol.Optional("enabled"): cv.boolean,
    vol.Optional("time"): cv.string,
    vol.Optional("repeat"): vol.In(REPEAT_MODES),
    vol.Optional("weekdays"): vol.All(cv.ensure_list, [vol.All(vol.Coerce(int), vol.Range(0, 6))]),
    vol.Optional("date"): cv.string,
    vol.Optional("media_player"): cv.entity_id,
    vol.Optional("source_uri"): cv.string,
    vol.Optional("source_kind"): vol.In(SOURCE_KINDS),
    vol.Optional("volume"): vol.All(vol.Coerce(float), vol.Range(0.0, 1.0)),
    vol.Optional("fade_seconds"): vol.All(vol.Coerce(int), vol.Range(0, 3600)),
    vol.Optional("snooze_minutes"): vol.All(vol.Coerce(int), vol.Range(1, 120)),
    vol.Optional("auto_dismiss_minutes"): vol.All(vol.Coerce(int), vol.Range(1, 240)),
    vol.Optional("pre_alarm_minutes"): vol.All(vol.Coerce(int), vol.Range(0, 240)),
    vol.Optional("pre_alarm_script"): vol.Any(cv.entity_id, None),
}

CREATE_SCHEMA = vol.Schema(
    {
        **_ALARM_FIELDS,
        vol.Required("time"): cv.string,
        vol.Required("media_player"): cv.entity_id,
        vol.Required("source_uri"): cv.string,
    }
)
UPDATE_SCHEMA = vol.Schema({**_ALARM_FIELDS, vol.Required(ATTR_ALARM_ID): cv.string})
TARGET_SCHEMA = vol.Schema({vol.Required(ATTR_ALARM_ID): cv.string})
SNOOZE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ALARM_ID): cv.string,
        vol.Optional("minutes"): vol.All(vol.Coerce(int), vol.Range(1, 120)),
    }
)
DISMISS_SCHEMA = vol.Schema({vol.Optional(ATTR_ALARM_ID): cv.string})
SKIP_SCHEMA = vol.Schema(
    {vol.Required(ATTR_ALARM_ID): cv.string, vol.Optional("skip", default=True): cv.boolean}
)


@dataclass
class WakeyData:
    """Everything the integration needs at runtime."""

    store: WakeyStore
    scheduler: WakeyScheduler
    player: WakeyPlayer


def _get_data(hass: HomeAssistant) -> WakeyData | None:
    """Wakey is single-instance, so there is only ever one of these."""
    entries = hass.data.get(DOMAIN, {})
    return next(iter(entries.values()), None)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Wakey from a config entry."""
    store = WakeyStore(hass)
    await store.async_load()

    player = WakeyPlayer(hass, store)
    scheduler = WakeyScheduler(
        hass, store, player.async_fire, player.async_run_pre_alarm
    )

    data = WakeyData(store=store, scheduler=scheduler, player=player)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = data

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await scheduler.async_start()

    # Deleting an alarm removes its device, which takes its entities with it.
    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ALARM_REMOVED, _make_device_cleanup(hass))
    )

    _async_register_services(hass)
    async_register_websocket(hass)
    await async_register_panel(hass)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unloaded:
        return False

    data: WakeyData = hass.data[DOMAIN].pop(entry.entry_id)
    data.scheduler.async_stop()
    data.player.async_shutdown()
    await data.store.async_save_now()
    async_unregister_panel(hass)

    if not hass.data[DOMAIN]:
        hass.data.pop(DOMAIN)
        for service in (
            SERVICE_CREATE,
            SERVICE_UPDATE,
            SERVICE_DELETE,
            SERVICE_SNOOZE,
            SERVICE_DISMISS,
            SERVICE_SKIP_NEXT,
            SERVICE_TRIGGER_NOW,
        ):
            hass.services.async_remove(DOMAIN, service)

    return True


@callback
def _make_device_cleanup(hass: HomeAssistant):
    @callback
    def _cleanup(alarm_id: str) -> None:
        registry = dr.async_get(hass)
        device = registry.async_get_device(identifiers={(DOMAIN, alarm_id)})
        if device is not None:
            registry.async_remove_device(device.id)

    return _cleanup


@callback
def _async_register_services(hass: HomeAssistant) -> None:
    """Register the domain services. Idempotent."""
    if hass.services.has_service(DOMAIN, SERVICE_CREATE):
        return

    async def _create(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        alarm = data.store.async_create(dict(call.data))
        _LOGGER.info("Created alarm %s (%s)", alarm.name, alarm.id)

    async def _update(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        changes = dict(call.data)
        alarm_id = changes.pop(ATTR_ALARM_ID)
        if data.store.async_update(alarm_id, changes) is None:
            _LOGGER.warning("No alarm with id %s", alarm_id)

    async def _delete(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        alarm_id = call.data[ATTR_ALARM_ID]
        await data.player.async_dismiss(alarm_id, reason="deleted")
        if not data.store.async_delete(alarm_id):
            _LOGGER.warning("No alarm with id %s", alarm_id)

    async def _snooze(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        minutes = call.data.get("minutes")
        if (alarm_id := call.data.get(ATTR_ALARM_ID)) is not None:
            await data.player.async_snooze(alarm_id, minutes)
            return
        # No target: snooze whatever is currently going off.
        for ringing_id in list(data.player.ringing):
            await data.player.async_snooze(ringing_id, minutes)

    async def _dismiss(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        if (alarm_id := call.data.get(ATTR_ALARM_ID)) is not None:
            await data.player.async_dismiss(alarm_id)
            return
        await data.player.async_dismiss_all()

    async def _skip_next(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        data.store.async_update(
            call.data[ATTR_ALARM_ID], {"skip_next": call.data["skip"]}
        )

    async def _trigger_now(call: ServiceCall) -> None:
        if (data := _get_data(hass)) is None:
            return
        alarm = data.store.async_get(call.data[ATTR_ALARM_ID])
        if alarm is None:
            _LOGGER.warning("No alarm with id %s", call.data[ATTR_ALARM_ID])
            return
        await data.player.async_fire(alarm)

    for service, handler, schema in (
        (SERVICE_CREATE, _create, CREATE_SCHEMA),
        (SERVICE_UPDATE, _update, UPDATE_SCHEMA),
        (SERVICE_DELETE, _delete, TARGET_SCHEMA),
        (SERVICE_SNOOZE, _snooze, SNOOZE_SCHEMA),
        (SERVICE_DISMISS, _dismiss, DISMISS_SCHEMA),
        (SERVICE_SKIP_NEXT, _skip_next, SKIP_SCHEMA),
        (SERVICE_TRIGGER_NOW, _trigger_now, TARGET_SCHEMA),
    ):
        hass.services.async_register(DOMAIN, service, handler, schema=schema)
