"""Editable time entity for each Wakey alarm.

Exposing the alarm time as a real `time` entity means it can be changed from
the normal Home Assistant UI, a dashboard card or an automation — not only
from the Wakey panel.
"""

from __future__ import annotations

from datetime import time as dt_time

from homeassistant.components.time import TimeEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, SIGNAL_ALARM_REGISTERED
from .entity import WakeyAlarmEntity
from .occurrence import parse_time
from .store import AlarmEntry


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    data = hass.data[DOMAIN][entry.entry_id]

    @callback
    def _add(alarm: AlarmEntry) -> None:
        async_add_entities([WakeyAlarmTime(data, alarm.id)])

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ALARM_REGISTERED, _add)
    )
    async_add_entities(
        WakeyAlarmTime(data, alarm.id) for alarm in data.store.async_all()
    )


class WakeyAlarmTime(WakeyAlarmEntity, TimeEntity):
    """The time this alarm goes off."""

    _attr_name = "Time"
    _attr_icon = "mdi:clock-outline"

    def __init__(self, data, alarm_id: str) -> None:
        super().__init__(data, alarm_id)
        self._attr_unique_id = f"{alarm_id}_time"

    @property
    def native_value(self) -> dt_time | None:
        alarm = self.alarm
        if alarm is None:
            return None
        try:
            return parse_time(alarm.time)
        except (ValueError, IndexError):
            return None

    async def async_set_value(self, value: dt_time) -> None:
        # The store compares before writing, so setting the same value again
        # is a no-op and cannot bounce back here as another update.
        self._data.store.async_update(
            self._alarm_id, {"time": f"{value.hour:02d}:{value.minute:02d}"}
        )
