"""Shared base for Wakey entities."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME, SIGNAL_ALARMS_CHANGED, SIGNAL_RUNTIME_CHANGED, VERSION
from .store import AlarmEntry


class WakeyAlarmEntity(Entity):
    """Base for entities that belong to a single alarm.

    Each alarm is its own device, so its switch/time/sensor group together in
    the UI. All state is read live from the store — these entities never hold
    their own copy, which is what keeps them from drifting out of sync with
    the panel.
    """

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, data, alarm_id: str) -> None:
        self._data = data
        self._alarm_id = alarm_id
        alarm = data.store.async_get(alarm_id)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, alarm_id)},
            name=alarm.name if alarm else NAME,
            manufacturer=NAME,
            model="Alarm",
            sw_version=VERSION,
        )

    @property
    def alarm(self) -> AlarmEntry | None:
        return self._data.store.async_get(self._alarm_id)

    @property
    def available(self) -> bool:
        return self.alarm is not None

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_ALARMS_CHANGED, self._handle_update
            )
        )
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_RUNTIME_CHANGED, self._handle_update
            )
        )

    @callback
    def _handle_update(self, *_args) -> None:
        # Must be a @callback: async_dispatcher_connect runs undecorated
        # functions in an executor thread, and async_write_ha_state is not
        # thread safe.
        self.async_write_ha_state()
