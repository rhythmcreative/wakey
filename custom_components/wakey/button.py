"""Per-alarm test button."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
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
        async_add_entities([WakeyTestButton(data, alarm.id)])

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ALARM_REGISTERED, _add)
    )
    async_add_entities(WakeyTestButton(data, alarm.id) for alarm in data.store.async_all())


class WakeyTestButton(WakeyAlarmEntity, ButtonEntity):
    """Fire this alarm right now.

    The point is to prove the speaker and source actually work before you rely
    on them at 6am.
    """

    _attr_name = "Test"
    _attr_icon = "mdi:play-circle-outline"

    def __init__(self, data, alarm_id: str) -> None:
        super().__init__(data, alarm_id)
        self._attr_unique_id = f"{alarm_id}_test"

    async def async_press(self) -> None:
        if (alarm := self.alarm) is not None:
            await self._data.player.async_fire(alarm)
