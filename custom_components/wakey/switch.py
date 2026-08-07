"""Enable/disable switch for each Wakey alarm."""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, SIGNAL_ALARM_REGISTERED
from .entity import WakeyAlarmEntity
from .store import AlarmEntry


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    data = hass.data[DOMAIN][entry.entry_id]

    @callback
    def _add(alarm: AlarmEntry) -> None:
        async_add_entities([WakeyAlarmSwitch(data, alarm.id)])

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ALARM_REGISTERED, _add)
    )
    async_add_entities(
        WakeyAlarmSwitch(data, alarm.id) for alarm in data.store.async_all()
    )


class WakeyAlarmSwitch(WakeyAlarmEntity, SwitchEntity):
    """Whether this alarm is armed."""

    _attr_name = None  # takes the device (alarm) name
    _attr_icon = "mdi:alarm"

    def __init__(self, data, alarm_id: str) -> None:
        super().__init__(data, alarm_id)
        self._attr_unique_id = f"{alarm_id}_enabled"

    @property
    def is_on(self) -> bool:
        alarm = self.alarm
        return bool(alarm and alarm.enabled)

    @property
    def extra_state_attributes(self) -> dict:
        alarm = self.alarm
        if alarm is None:
            return {}
        return {
            "time": alarm.time,
            "repeat": alarm.repeat,
            "weekdays": alarm.weekdays,
            "date": alarm.date,
            "skip_next": alarm.skip_next,
            "media_player": alarm.media_player,
            "volume": alarm.volume,
            "ringing": self._alarm_id in self._data.player.ringing,
        }

    async def async_turn_on(self, **kwargs) -> None:
        self._data.store.async_update(self._alarm_id, {"enabled": True})

    async def async_turn_off(self, **kwargs) -> None:
        self._data.store.async_update(self._alarm_id, {"enabled": False})
        await self._data.player.async_dismiss(self._alarm_id, reason="disabled")
