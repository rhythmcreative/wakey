"""Global ringing indicator."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    NAME,
    SIGNAL_ALARMS_CHANGED,
    SIGNAL_RUNTIME_CHANGED,
    VERSION,
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    async_add_entities([WakeyRingingBinarySensor(hass.data[DOMAIN][entry.entry_id])])


class WakeyRingingBinarySensor(BinarySensorEntity):
    """On while any alarm is actually sounding.

    Snoozed alarms deliberately read off — this is the entity you would hang a
    "stop the music" automation off, and a snoozed alarm is not making noise.
    """

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_name = "Ringing"
    _attr_icon = "mdi:bell-ring"
    _attr_unique_id = f"{DOMAIN}_ringing"

    def __init__(self, data) -> None:
        self._data = data
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, DOMAIN)},
            name=NAME,
            manufacturer=NAME,
            model="Alarm clock",
            sw_version=VERSION,
        )

    @property
    def is_on(self) -> bool:
        return self._data.player.any_ringing

    @property
    def extra_state_attributes(self) -> dict:
        ringing = [
            aid for aid, s in self._data.player.ringing.items() if not s.snoozed
        ]
        snoozed = [aid for aid, s in self._data.player.ringing.items() if s.snoozed]
        names = {a.id: a.name for a in self._data.store.async_all()}
        return {
            "ringing": ringing,
            "snoozed": snoozed,
            "names": [names.get(a, a) for a in ringing],
        }

    async def async_added_to_hass(self) -> None:
        for signal in (SIGNAL_RUNTIME_CHANGED, SIGNAL_ALARMS_CHANGED):
            self.async_on_remove(
                async_dispatcher_connect(self.hass, signal, self._handle_update)
            )

    @callback
    def _handle_update(self, *_args) -> None:
        self.async_write_ha_state()
