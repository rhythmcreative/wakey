"""Diagnostics for the Wakey config entry.

Deliberately includes the computed next-fire times and the pending timer set,
because "why didn't it go off" is the question a bug report needs to answer.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import DOMAIN, VERSION


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    data = hass.data[DOMAIN][entry.entry_id]

    alarms = []
    for alarm in data.store.async_all():
        record = alarm.to_dict()
        nxt = data.scheduler.async_next_fire(alarm)
        record["computed_next_fire"] = nxt.isoformat() if nxt else None
        record["is_ringing"] = alarm.id in data.player.ringing
        alarms.append(record)

    return {
        "version": VERSION,
        "now_utc": dt_util.utcnow().isoformat(),
        "time_zone": hass.config.time_zone,
        "alarm_count": len(alarms),
        "alarms": alarms,
        "pending_timers": sorted(data.scheduler._timers.keys()),  # noqa: SLF001
        "pending_pre_alarm_timers": sorted(data.scheduler._pre_timers.keys()),  # noqa: SLF001
        "ringing": {
            alarm_id: {"snoozed": state.snoozed, "attempts": state.attempts}
            for alarm_id, state in data.player.ringing.items()
        },
    }
