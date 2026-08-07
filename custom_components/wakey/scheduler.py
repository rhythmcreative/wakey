"""Timer management for Wakey.

Keeps exactly one pending timer per alarm, pointed at that alarm's next
occurrence, and recomputes whenever anything changes. All the awkward date
math lives in occurrence.py; this module is only concerned with when to ask
for it and what to do when a timer fires.
"""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from datetime import datetime, timedelta, tzinfo
from zoneinfo import ZoneInfo

from homeassistant.const import EVENT_CORE_CONFIG_UPDATE, EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import CALLBACK_TYPE, CoreState, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.util import dt as dt_util

from . import occurrence
from .const import (
    MISSED_ALARM_GRACE,
    SIGNAL_ALARMS_CHANGED,
    SIGNAL_RUNTIME_CHANGED,
)
from .store import AlarmEntry, WakeyStore

_LOGGER = logging.getLogger(__name__)

FireCallback = Callable[[AlarmEntry, bool], Awaitable[None]]


class WakeyScheduler:
    """Owns the pending timers for every alarm."""

    def __init__(self, hass: HomeAssistant, store: WakeyStore, fire: FireCallback) -> None:
        self.hass = hass
        self.store = store
        self._fire = fire
        self._timers: dict[str, CALLBACK_TYPE] = {}
        self._unsubs: list[CALLBACK_TYPE] = []

    # --- lifecycle ---------------------------------------------------------

    async def async_start(self) -> None:
        """Begin scheduling. Safe to call during setup."""
        self._unsubs.append(
            async_dispatcher_connect(self.hass, SIGNAL_ALARMS_CHANGED, self._handle_changed)
        )
        # A timezone change silently invalidates every computed instant.
        self._unsubs.append(
            self.hass.bus.async_listen(EVENT_CORE_CONFIG_UPDATE, self._handle_core_config)
        )

        if self.hass.state is CoreState.running:
            await self._async_catch_up()
        else:
            self._unsubs.append(
                self.hass.bus.async_listen_once(
                    EVENT_HOMEASSISTANT_STARTED, self._handle_started
                )
            )
        self.async_reschedule_all()

    @callback
    def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._cancel_all()

    # --- scheduling --------------------------------------------------------

    def _tz(self) -> tzinfo:
        tz = getattr(dt_util, "DEFAULT_TIME_ZONE", None)
        if tz is not None:
            return tz
        return ZoneInfo(self.hass.config.time_zone)

    @callback
    def async_next_fire(self, alarm: AlarmEntry) -> datetime | None:
        """Effective next fire time, honouring skip_next. Used by sensors."""
        if not alarm.enabled:
            return None
        return occurrence.next_occurrence(
            time_str=alarm.time,
            repeat=alarm.repeat,
            weekdays=alarm.weekdays,
            one_off_date=alarm.date,
            tz=self._tz(),
            now_utc=dt_util.utcnow(),
            skip_next=alarm.skip_next,
        )

    @callback
    def _raw_next_fire(self, alarm: AlarmEntry) -> datetime | None:
        """Next occurrence ignoring skip_next.

        Timers are always set to this. If skip_next is set when the timer
        fires, the flag is consumed there and the alarm stays quiet. Doing it
        this way keeps the flag cleared at exactly the right moment without a
        second timer.
        """
        if not alarm.enabled:
            return None
        return occurrence.next_occurrence(
            time_str=alarm.time,
            repeat=alarm.repeat,
            weekdays=alarm.weekdays,
            one_off_date=alarm.date,
            tz=self._tz(),
            now_utc=dt_util.utcnow(),
        )

    @callback
    def async_reschedule_all(self) -> None:
        self._cancel_all()
        for alarm in self.store.async_all():
            self._schedule(alarm)

    @callback
    def _schedule(self, alarm: AlarmEntry) -> None:
        when = self._raw_next_fire(alarm)
        if when is None:
            return

        @callback
        def _fired(_now: datetime) -> None:
            self._timers.pop(alarm.id, None)
            self.hass.async_create_task(self._async_handle_timer(alarm.id))

        self._timers[alarm.id] = async_track_point_in_utc_time(self.hass, _fired, when)
        _LOGGER.debug("Scheduled %s (%s) for %s", alarm.name, alarm.id, when)

    @callback
    def _cancel_all(self) -> None:
        for unsub in self._timers.values():
            unsub()
        self._timers.clear()

    # --- handlers ----------------------------------------------------------

    async def _async_handle_timer(self, alarm_id: str) -> None:
        alarm = self.store.async_get(alarm_id)
        if alarm is None or not alarm.enabled:
            return

        if alarm.skip_next:
            _LOGGER.info("Skipping this occurrence of %s as requested", alarm.name)
            self.store.async_update(alarm_id, {"skip_next": False})
            # async_update dispatches SIGNAL_ALARMS_CHANGED, which reschedules.
            return

        await self._fire(alarm, False)
        self._schedule_one(alarm_id)

    @callback
    def _schedule_one(self, alarm_id: str) -> None:
        if (unsub := self._timers.pop(alarm_id, None)) is not None:
            unsub()
        if (alarm := self.store.async_get(alarm_id)) is not None:
            self._schedule(alarm)

    @callback
    def _handle_changed(self) -> None:
        self.async_reschedule_all()

    @callback
    def _handle_core_config(self, _event) -> None:
        _LOGGER.debug("Core config changed — recomputing all alarm times")
        self.async_reschedule_all()

    async def _handle_started(self, _event) -> None:
        await self._async_catch_up()
        self.async_reschedule_all()

    # --- missed alarms -----------------------------------------------------

    async def _async_catch_up(self) -> None:
        """Fire alarms that came due while Home Assistant was down.

        Only within the grace window — waking someone an hour late is worse
        than not waking them at all.
        """
        now = dt_util.utcnow()
        tz = self._tz()

        for alarm in self.store.async_all():
            if not alarm.enabled:
                continue

            previous = occurrence.previous_occurrence(
                time_str=alarm.time,
                repeat=alarm.repeat,
                weekdays=alarm.weekdays,
                one_off_date=alarm.date,
                tz=tz,
                now_utc=now,
            )
            if previous is None:
                continue

            last_fired = dt_util.parse_datetime(alarm.last_fired) if alarm.last_fired else None
            if last_fired is not None and last_fired >= previous:
                continue  # already handled it

            if alarm.skip_next:
                _LOGGER.info(
                    "Missed occurrence of %s was the skipped one — clearing flag", alarm.name
                )
                self.store.async_update(alarm.id, {"skip_next": False})
                continue

            behind = now - previous
            if behind > timedelta(seconds=MISSED_ALARM_GRACE):
                _LOGGER.info(
                    "%s was missed by %s while Home Assistant was down — skipping "
                    "(beyond the %ds grace window)",
                    alarm.name,
                    behind,
                    MISSED_ALARM_GRACE,
                )
                self.store.async_update(alarm.id, {"last_fired": previous.isoformat()})
                continue

            _LOGGER.warning(
                "Firing %s now — it was missed by %s while Home Assistant was down",
                alarm.name,
                behind,
            )
            await self._fire(alarm, True)

        async_dispatcher_send(self.hass, SIGNAL_RUNTIME_CHANGED)
