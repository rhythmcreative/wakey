# Changelog

## 0.1.0

First release.

### Added

- Alarms with weekday repeat or a one-off date, stored in Home Assistant's
  own storage and editable from a sidebar panel.
- **Volume fade-in** from a configurable floor up to the target volume.
- **Playback failsafe** — after firing, Wakey verifies the speaker actually
  reached `playing`, retries once, then raises a persistent notification and
  fires `wakey_alarm_failed`.
- **Skip next**, which skips a single occurrence and clears itself afterwards.
- **Pre-alarm hook** — run a script a set number of minutes ahead.
- **Missed-alarm recovery.** An alarm that came due while Home Assistant was
  down fires on startup, but only within a grace window.
- **Snooze and dismiss**, with auto-dismiss after a configurable timeout.
- Music Assistant and generic `media_player` sources.
- Entities per alarm: `switch`, editable `time`, next-fire `sensor`, test
  `button`, and a skip-next `switch` (disabled by default). Globally:
  `sensor.wakey_next_alarm` and `binary_sensor.wakey_ringing`.
- Actions for create, update, delete, snooze, dismiss, skip_next and
  trigger_now.
- Diagnostics download including computed next-fire times and pending timers.

### Notes

- DST is handled explicitly: a time inside the spring-forward gap fires at the
  transition instant rather than an hour late, and the repeated hour on
  fall-back rings exactly once. Both are unit tested.
- The panel is not admin-only. Creating and editing alarms is, but viewing the
  schedule and snoozing are not.
