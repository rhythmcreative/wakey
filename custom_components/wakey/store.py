"""Persistent storage for Wakey alarms.

The store is the single source of truth. Entities and the panel are both views
over it, and every mutation goes through here so there is exactly one place
that validates, saves and notifies.
"""

from __future__ import annotations

import logging
import uuid
from dataclasses import asdict, dataclass, field, fields
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_AUTO_DISMISS_MINUTES,
    DEFAULT_FADE_SECONDS,
    DEFAULT_SNOOZE_MINUTES,
    DEFAULT_VOLUME,
    DOMAIN,
    REPEAT_MODES,
    REPEAT_WEEKLY,
    SIGNAL_ALARM_REGISTERED,
    SIGNAL_ALARM_REMOVED,
    SIGNAL_ALARMS_CHANGED,
    SOURCE_KINDS,
    SOURCE_MUSIC_ASSISTANT,
)

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = f"{DOMAIN}.storage"
STORAGE_VERSION_MAJOR = 1
STORAGE_VERSION_MINOR = 0
SAVE_DELAY = 5


@dataclass
class AlarmEntry:
    """One alarm."""

    id: str
    name: str = "Alarm"
    enabled: bool = True
    time: str = "07:00"
    repeat: str = REPEAT_WEEKLY
    weekdays: list[int] = field(default_factory=lambda: [0, 1, 2, 3, 4])
    date: str | None = None
    skip_next: bool = False
    media_player: str = ""
    source_uri: str = ""
    source_kind: str = SOURCE_MUSIC_ASSISTANT
    volume: float = DEFAULT_VOLUME
    fade_seconds: int = DEFAULT_FADE_SECONDS
    snooze_minutes: int = DEFAULT_SNOOZE_MINUTES
    auto_dismiss_minutes: int = DEFAULT_AUTO_DISMISS_MINUTES
    last_fired: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> AlarmEntry:
        known = {f.name for f in fields(cls)}
        return cls(**{k: v for k, v in data.items() if k in known})


def coerce(data: dict[str, Any]) -> dict[str, Any]:
    """Validate and clamp incoming alarm fields.

    Unknown keys are dropped by AlarmEntry.from_dict; this only has to make
    the known ones safe. Anything invalid falls back to a sane default rather
    than raising, so a malformed panel payload can't wedge the store.
    """
    out = dict(data)

    if "volume" in out:
        try:
            out["volume"] = min(1.0, max(0.0, float(out["volume"])))
        except (TypeError, ValueError):
            out["volume"] = DEFAULT_VOLUME

    for key, default, lo, hi in (
        ("fade_seconds", DEFAULT_FADE_SECONDS, 0, 3600),
        ("snooze_minutes", DEFAULT_SNOOZE_MINUTES, 1, 120),
        ("auto_dismiss_minutes", DEFAULT_AUTO_DISMISS_MINUTES, 1, 240),
    ):
        if key in out:
            try:
                out[key] = min(hi, max(lo, int(out[key])))
            except (TypeError, ValueError):
                out[key] = default

    if "repeat" in out and out["repeat"] not in REPEAT_MODES:
        out["repeat"] = REPEAT_WEEKLY

    if "source_kind" in out and out["source_kind"] not in SOURCE_KINDS:
        out["source_kind"] = SOURCE_MUSIC_ASSISTANT

    if "weekdays" in out:
        try:
            out["weekdays"] = sorted({int(d) for d in out["weekdays"] if 0 <= int(d) <= 6})
        except (TypeError, ValueError):
            out["weekdays"] = []

    if "time" in out and isinstance(out["time"], str):
        parts = out["time"].split(":")
        try:
            out["time"] = f"{int(parts[0]):02d}:{int(parts[1]):02d}"
        except (ValueError, IndexError):
            out.pop("time")

    return out


class MigratableStore(Store):
    """Store that knows how to bring older payloads forward."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict
    ) -> dict:
        # v1.0 is the first shipped schema. Anything claiming to be older than
        # that predates the public release and is not worth carrying forward.
        if old_major_version < STORAGE_VERSION_MAJOR:
            _LOGGER.warning(
                "Wakey storage from an unreleased schema (v%s.%s) discarded",
                old_major_version,
                old_minor_version,
            )
            return {"alarms": []}
        return old_data


class WakeyStore:
    """Load, mutate and persist the alarm collection."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.alarms: dict[str, AlarmEntry] = {}
        self._store = MigratableStore(
            hass,
            STORAGE_VERSION_MAJOR,
            STORAGE_KEY,
            minor_version=STORAGE_VERSION_MINOR,
            private=True,
        )

    async def async_load(self) -> None:
        data = await self._store.async_load()
        self.alarms = {}
        if not data:
            return
        for raw in data.get("alarms", []):
            try:
                entry = AlarmEntry.from_dict(raw)
            except TypeError:
                _LOGGER.warning("Skipping unreadable stored alarm: %s", raw)
                continue
            self.alarms[entry.id] = entry
        _LOGGER.debug("Loaded %d alarm(s)", len(self.alarms))

    # --- reads -------------------------------------------------------------

    @callback
    def async_get(self, alarm_id: str) -> AlarmEntry | None:
        return self.alarms.get(alarm_id)

    @callback
    def async_all(self) -> list[AlarmEntry]:
        return sorted(self.alarms.values(), key=lambda a: (a.time, a.name))

    # --- writes ------------------------------------------------------------

    @callback
    def async_create(self, data: dict[str, Any]) -> AlarmEntry:
        payload = coerce(data)
        payload["id"] = payload.get("id") or uuid.uuid4().hex
        entry = AlarmEntry.from_dict(payload)
        self.alarms[entry.id] = entry
        self._save()
        async_dispatcher_send(self.hass, SIGNAL_ALARM_REGISTERED, entry)
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)
        return entry

    @callback
    def async_update(self, alarm_id: str, changes: dict[str, Any]) -> AlarmEntry | None:
        entry = self.alarms.get(alarm_id)
        if entry is None:
            return None

        payload = coerce(changes)
        payload.pop("id", None)

        # Compare before writing. Without this a no-op write (very easy to
        # produce from the time entity, which re-reads state after every
        # dispatch) would save and dispatch again, and the entity would write
        # back — an infinite ping-pong.
        touched = False
        for key, value in payload.items():
            if not hasattr(entry, key):
                continue
            if getattr(entry, key) != value:
                setattr(entry, key, value)
                touched = True

        if not touched:
            return entry

        self._save()
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)
        return entry

    @callback
    def async_delete(self, alarm_id: str) -> bool:
        if alarm_id not in self.alarms:
            return False
        del self.alarms[alarm_id]
        self._save()
        async_dispatcher_send(self.hass, SIGNAL_ALARM_REMOVED, alarm_id)
        async_dispatcher_send(self.hass, SIGNAL_ALARMS_CHANGED)
        return True

    # --- persistence -------------------------------------------------------

    @callback
    def _save(self) -> None:
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)

    @callback
    def _data_to_save(self) -> dict[str, Any]:
        return {"alarms": [a.to_dict() for a in self.alarms.values()]}

    async def async_save_now(self) -> None:
        """Flush immediately — used on unload so nothing is lost."""
        await self._store.async_save(self._data_to_save())
