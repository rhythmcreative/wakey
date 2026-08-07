"""Next-fire sensors for Wakey."""

from __future__ import annotations

from datetime import datetime

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    NAME,
    SIGNAL_ALARM_REGISTERED,
    SIGNAL_ALARMS_CHANGED,
    SIGNAL_RUNTIME_CHANGED,
    VERSION,
)
from .entity import WakeyAlarmEntity
from .store import AlarmEntry


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    data = hass.data[DOMAIN][entry.entry_id]

    @callback
    def _add(alarm: AlarmEntry) -> None:
        async_add_entities([WakeyAlarmNextSensor(data, alarm.id)])

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ALARM_REGISTERED, _add)
    )

    entities: list[SensorEntity] = [
        WakeyAlarmNextSensor(data, alarm.id) for alarm in data.store.async_all()
    ]
    entities.append(WakeyNextAlarmSensor(data))
    async_add_entities(entities)


class WakeyAlarmNextSensor(WakeyAlarmEntity, SensorEntity):
    """When this particular alarm next goes off."""

    _attr_name = "Next"
    _attr_icon = "mdi:alarm-check"
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, data, alarm_id: str) -> None:
        super().__init__(data, alarm_id)
        self._attr_unique_id = f"{alarm_id}_next"

    @property
    def native_value(self) -> datetime | None:
        alarm = self.alarm
        if alarm is None:
            return None
        return self._data.scheduler.async_next_fire(alarm)


class WakeyNextAlarmSensor(SensorEntity):
    """The soonest alarm across every configured alarm."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_name = "Next alarm"
    _attr_icon = "mdi:alarm"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_unique_id = f"{DOMAIN}_next_alarm"

    def __init__(self, data) -> None:
        self._data = data
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, DOMAIN)},
            name=NAME,
            manufacturer=NAME,
            model="Alarm clock",
            sw_version=VERSION,
        )

    def _soonest(self) -> tuple[datetime | None, AlarmEntry | None]:
        best: datetime | None = None
        best_alarm: AlarmEntry | None = None
        for alarm in self._data.store.async_all():
            when = self._data.scheduler.async_next_fire(alarm)
            if when is not None and (best is None or when < best):
                best, best_alarm = when, alarm
        return best, best_alarm

    @property
    def native_value(self) -> datetime | None:
        return self._soonest()[0]

    @property
    def extra_state_attributes(self) -> dict:
        _when, alarm = self._soonest()
        ringing = [
            aid for aid, state in self._data.player.ringing.items() if not state.snoozed
        ]
        snoozed = [
            aid for aid, state in self._data.player.ringing.items() if state.snoozed
        ]
        return {
            "alarm_id": alarm.id if alarm else None,
            "alarm_name": alarm.name if alarm else None,
            "total_alarms": len(self._data.store.async_all()),
            "ringing": ringing,
            "snoozed": snoozed,
        }

    async def async_added_to_hass(self) -> None:
        for signal in (SIGNAL_ALARMS_CHANGED, SIGNAL_RUNTIME_CHANGED):
            self.async_on_remove(
                async_dispatcher_connect(self.hass, signal, self._handle_update)
            )

    @callback
    def _handle_update(self, *_args) -> None:
        self.async_write_ha_state()
