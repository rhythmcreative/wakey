# Wakey

An alarm clock for Home Assistant.

Home Assistant can do almost anything on a schedule, but it has never had an
alarm clock — the thing you actually rely on to wake you up, with a snooze
button, weekday repeat, and the confidence that it will go off. Wakey adds one.

> **Status: early.** Phase 1 (the scheduling and playback engine) is done and
> usable via actions. The sidebar panel is next.

## What makes it different

- **Volume fade-in.** Ramp from a whisper up to your target volume over a
  configurable window, instead of being detonated awake at full blast. The ramp
  backs off if you reach for the volume yourself.
- **A failsafe.** After firing, Wakey checks the speaker actually reached
  `playing`. If it didn't, it retries, then raises a notification and fires a
  `wakey_alarm_failed` event you can hang your own escalation off. An alarm that
  fails silently is worse than no alarm.
- **Skip next.** Off tomorrow? Skip one occurrence without disarming the alarm
  and forgetting to turn it back on.
- **Survives a restart.** If Home Assistant was down when an alarm was due, it
  fires on startup — but only inside a grace window, because being woken an hour
  late is worse than not being woken.
- **Correct across DST.** The nonexistent hour on spring-forward fires at the
  transition rather than an hour late; the repeated hour on fall-back rings once.
  This is unit tested, not hoped for.
- **Native entities.** Every alarm is a device with a `switch`, an editable
  `time`, and a next-fire `sensor`, so alarms work with normal automations,
  dashboards and voice — not just inside Wakey.

## Requirements

- Home Assistant 2026.3 or newer
- Optional: [Music Assistant](https://music-assistant.io/) for library playback

## Installation

Not yet in the default HACS index. Add it as a custom repository:

1. HACS → ⋮ → Custom repositories
2. Repository `johnrcarty/wakey`, category **Integration**
3. Install, restart Home Assistant
4. Settings → Devices & Services → Add Integration → **Wakey**

## Creating an alarm

Until the panel ships, use Developer Tools → Actions → `wakey.create`:

```yaml
action: wakey.create
data:
  name: Weekday
  time: "06:30"
  repeat: weekly
  weekdays: [0, 1, 2, 3, 4]     # Mon=0 … Sun=6
  media_player: media_player.bedroom
  source_kind: music_assistant
  source_uri: library://track/6018
  volume: 0.7
  fade_seconds: 60
```

`source_uri` takes a Music Assistant URI (browse to one in the media browser), a
media content ID, or plain search text.

## Actions

| Action | Purpose |
|---|---|
| `wakey.create` | Add an alarm |
| `wakey.update` | Patch fields on an alarm (`alarm_id` plus what changed) |
| `wakey.delete` | Remove an alarm and its entities |
| `wakey.snooze` | Silence a ringing alarm; omit `alarm_id` for whatever is ringing |
| `wakey.dismiss` | Stop until the next occurrence |
| `wakey.skip_next` | Skip one occurrence, then resume |
| `wakey.trigger_now` | Fire immediately — use this to test a speaker and source |

## Entities

Per alarm: `switch.<name>` (armed), `time.<name>_time`, `sensor.<name>_next`.

Global: `sensor.wakey_next_alarm` — the soonest alarm across all of them, with
`alarm_id`, `alarm_name`, `ringing` and `snoozed` attributes.

## Events

Hang your own automations off these:

`wakey_alarm_fired`, `wakey_alarm_snoozed`, `wakey_alarm_dismissed`,
`wakey_alarm_failed` — each carrying `alarm_id` and `name`.

## Development

```bash
uv venv --python 3.14 .venv          # HA 2026.7 requires Python 3.14+
uv pip install --python .venv/bin/python -r requirements_test.txt
.venv/bin/python -m pytest -q
```

Deploy to a live instance over SSH:

```bash
./scripts/deploy.sh my-ha-host
ssh my-ha-host 'ha core restart'     # Python changes need a restart
./scripts/logs.sh my-ha-host
```

`homeassistant.reload_config_entry` re-runs setup with the *old* code — there is
no supported hot reload for custom-component Python. Restart.

## Licence

MIT
