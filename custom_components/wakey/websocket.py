"""WebSocket API backing the Wakey panel.

The panel reads alarms from here rather than from hass.states, so it sees the
store directly and updates live via a subscription instead of polling.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import (
    ATTR_ALARM_ID,
    DOMAIN,
    REPEAT_MODES,
    SIGNAL_ALARMS_CHANGED,
    SIGNAL_RUNTIME_CHANGED,
    SOURCE_KINDS,
)

_LOGGER = logging.getLogger(__name__)

# Optional alarm fields shared by create and update.
_FIELDS = {
    vol.Optional("name"): str,
    vol.Optional("enabled"): bool,
    vol.Optional("time"): str,
    vol.Optional("repeat"): vol.In(REPEAT_MODES),
    vol.Optional("weekdays"): [vol.All(vol.Coerce(int), vol.Range(0, 6))],
    vol.Optional("date"): vol.Any(str, None),
    vol.Optional("media_player"): str,
    vol.Optional("source_uri"): str,
    vol.Optional("source_kind"): vol.In(SOURCE_KINDS),
    vol.Optional("volume"): vol.All(vol.Coerce(float), vol.Range(0.0, 1.0)),
    vol.Optional("fade_seconds"): vol.All(vol.Coerce(int), vol.Range(0, 3600)),
    vol.Optional("snooze_minutes"): vol.All(vol.Coerce(int), vol.Range(1, 120)),
    vol.Optional("auto_dismiss_minutes"): vol.All(vol.Coerce(int), vol.Range(1, 240)),
    vol.Optional("pre_alarm_minutes"): vol.All(vol.Coerce(int), vol.Range(0, 240)),
    vol.Optional("pre_alarm_script"): vol.Any(str, None),
}


def _get_data(hass: HomeAssistant):
    return next(iter(hass.data.get(DOMAIN, {}).values()), None)


@callback
def _snapshot(hass: HomeAssistant) -> dict[str, Any]:
    data = _get_data(hass)
    if data is None:
        return {"alarms": [], "ringing": [], "snoozed": []}

    alarms = []
    for alarm in data.store.async_all():
        entry = alarm.to_dict()
        nxt = data.scheduler.async_next_fire(alarm)
        entry["next_fire"] = nxt.isoformat() if nxt else None
        entry["is_ringing"] = (
            alarm.id in data.player.ringing and not data.player.ringing[alarm.id].snoozed
        )
        entry["is_snoozed"] = (
            alarm.id in data.player.ringing and data.player.ringing[alarm.id].snoozed
        )
        alarms.append(entry)

    return {
        "alarms": alarms,
        "ringing": [a["id"] for a in alarms if a["is_ringing"]],
        "snoozed": [a["id"] for a in alarms if a["is_snoozed"]],
    }


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register commands once per Home Assistant run.

    async_register_command is not safe to call twice for the same type, and a
    config-entry reload would otherwise do exactly that.
    """
    if hass.data.get(f"{DOMAIN}_ws_registered"):
        return
    hass.data[f"{DOMAIN}_ws_registered"] = True

    for handler in (
        ws_list,
        ws_subscribe,
        ws_create,
        ws_update,
        ws_delete,
        ws_snooze,
        ws_dismiss,
        ws_skip_next,
        ws_trigger,
    ):
        websocket_api.async_register_command(hass, handler)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/list"})
@callback
def ws_list(hass, connection, msg) -> None:
    connection.send_result(msg["id"], _snapshot(hass))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@callback
def ws_subscribe(hass, connection, msg) -> None:
    @callback
    def _forward(*_args) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], _snapshot(hass)))

    unsubs = [
        async_dispatcher_connect(hass, SIGNAL_ALARMS_CHANGED, _forward),
        async_dispatcher_connect(hass, SIGNAL_RUNTIME_CHANGED, _forward),
    ]

    @callback
    def _unsubscribe() -> None:
        for unsub in unsubs:
            unsub()

    connection.subscriptions[msg["id"]] = _unsubscribe
    connection.send_result(msg["id"])
    # Send the current state immediately so the panel needs one round trip,
    # not two, and cannot miss an update in between.
    _forward()


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/create", **_FIELDS}
)
@callback
def ws_create(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    payload = {k: v for k, v in msg.items() if k not in ("id", "type")}
    alarm = data.store.async_create(payload)
    connection.send_result(msg["id"], {"alarm_id": alarm.id})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/update", vol.Required(ATTR_ALARM_ID): str, **_FIELDS}
)
@callback
def ws_update(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    payload = {k: v for k, v in msg.items() if k not in ("id", "type", ATTR_ALARM_ID)}
    if data.store.async_update(msg[ATTR_ALARM_ID], payload) is None:
        connection.send_error(msg["id"], "not_found", "No such alarm")
        return
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/delete", vol.Required(ATTR_ALARM_ID): str}
)
@websocket_api.async_response
async def ws_delete(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    await data.player.async_dismiss(msg[ATTR_ALARM_ID], reason="deleted")
    if not data.store.async_delete(msg[ATTR_ALARM_ID]):
        connection.send_error(msg["id"], "not_found", "No such alarm")
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/snooze",
        vol.Optional(ATTR_ALARM_ID): str,
        vol.Optional("minutes"): vol.All(vol.Coerce(int), vol.Range(1, 120)),
    }
)
@websocket_api.async_response
async def ws_snooze(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    minutes = msg.get("minutes")
    if (alarm_id := msg.get(ATTR_ALARM_ID)) is not None:
        await data.player.async_snooze(alarm_id, minutes)
    else:
        for ringing_id in list(data.player.ringing):
            await data.player.async_snooze(ringing_id, minutes)
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/dismiss", vol.Optional(ATTR_ALARM_ID): str}
)
@websocket_api.async_response
async def ws_dismiss(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    if (alarm_id := msg.get(ATTR_ALARM_ID)) is not None:
        await data.player.async_dismiss(alarm_id)
    else:
        await data.player.async_dismiss_all()
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/skip_next",
        vol.Required(ATTR_ALARM_ID): str,
        vol.Optional("skip", default=True): bool,
    }
)
@callback
def ws_skip_next(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    data.store.async_update(msg[ATTR_ALARM_ID], {"skip_next": msg["skip"]})
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/trigger", vol.Required(ATTR_ALARM_ID): str}
)
@websocket_api.async_response
async def ws_trigger(hass, connection, msg) -> None:
    data = _get_data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Wakey is not set up")
        return
    alarm = data.store.async_get(msg[ATTR_ALARM_ID])
    if alarm is None:
        connection.send_error(msg["id"], "not_found", "No such alarm")
        return
    await data.player.async_fire(alarm)
    connection.send_result(msg["id"])
