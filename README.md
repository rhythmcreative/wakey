<h1 align="center">Wakey</h1>

<div align="center">

<p><i> An intuitive, resilient alarm clock for Home Assistant with continuous looping, repeat counts, speaker permissions, and a dedicated sidebar UI. </i></p>

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-41BDF5?style=for-the-badge&logo=homeassistant&logoColor=white)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange?style=for-the-badge&logo=homeassistantcommunitystore&logoColor=white)](https://hacs.xyz/)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=23&pause=1000&color=F7F7F7&vCenter=true&width=435&height=30&lines=ABOUT)](https://git.io/typing-svg)

Home Assistant can do almost anything on a schedule, but it has never had a dedicated, dependable alarm clock — the thing you actually rely on to wake you up every morning, with a snooze button, custom repeat loops, weekday recurrence, and the confidence that it will go off without fail.

**Wakey** adds a complete alarm system with its own clean, native page in the Home Assistant sidebar.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=rhythmcreative&repository=wakey&category=integration)

______________________________________________________________________

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=23&pause=1000&color=F7F7F7&vCenter=true&width=435&height=30&lines=FEATURES)](https://git.io/typing-svg)

- **Continuous Looping & Playback Repeats (`repeat_count`)**: Short audio files and alarm tones loop automatically while ringing so you never sleep through a 2-second clip. Choose infinite loop (`0`), single play (`1`), or any custom repeat count (`N`).
- **Volume Fade-In**: Ramp from a quiet whisper up to your target volume over a customizable duration, instead of detonating awake at full volume. Ramping automatically yields if you manually adjust volume.
- **Fail-Safe Playback Verification**: After firing, Wakey verifies the media player actually reached `playing`. If not, it retries and fires a `wakey_alarm_failed` event you can attach backup automations or mobile notifications to.
- **Skip Next**: Have a day off tomorrow? Skip the single next occurrence with one click without disabling the alarm or forgetting to turn it back on.
- **Adjust Next**: Need to wake up an hour earlier tomorrow or enjoy a lie-in? Move just the next occurrence to a new time. It rings once at the new time and reverts to its usual schedule automatically.
- **Pre-Alarm Automations**: Run scripts or automations minutes before the alarm (e.g., sunrise lights, bedroom heating, coffee maker).
- **Restart Survival**: If Home Assistant restarts or was down when an alarm was due, it safely triggers upon startup within a configurable grace window.
- **DST Compliant**: Fully handles daylight saving time transitions (spring forward and fall back) with complete test coverage.
- **Native Home Assistant Entities**: Every alarm generates native switches, time inputs, test buttons, and next-fire timestamp sensors.
- **Per-User Permissions**: Alarms belong to the user who created them. Administrators manage an allowlist of which speakers each household member can target.

______________________________________________________________________

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=23&pause=1000&color=F7F7F7&vCenter=true&width=435&height=30&lines=INSTALL)](https://git.io/typing-svg)

### Via HACS (Recommended)

1. Open **HACS** → Click the three dots (⋮) in the top right → **Custom repositories**.
2. Add `https://github.com/rhythmcreative/wakey` with category **Integration**.
3. Click **Download**, then restart Home Assistant.
4. Go to **Settings → Devices & Services → Add Integration** → Search for **Wakey**.
5. Click on **Wakey** in your left sidebar to start creating alarms!

*(Or click the button below to add directly)*

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=rhythmcreative&repository=wakey&category=integration)

______________________________________________________________________

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=23&pause=1000&color=F7F7F7&vCenter=true&width=435&height=30&lines=USAGE+%26+ACTIONS)](https://git.io/typing-svg)

### Adding an Alarm in the UI
From the Wakey sidebar panel:
- Set your wake-up time and days of the week.
- Choose your target media player speaker.
- Select your media track (Music Assistant library, local media file, or streaming URL).
- Open **Advanced** to set your **Playback repeats** (`0` = loop continuously until dismissed, `1` = once, `N` = N times), fade-in time, and snooze duration.

### Service Actions for Automations

```yaml
action: wakey.create
data:
  name: "Morning Alarm"
  time: "07:00"
  repeat: weekly
  weekdays: [0, 1, 2, 3, 4]       # Mon=0 … Sun=6
  media_player: media_player.bedroom_speaker
  source_kind: media_player       # or music_assistant
  source_uri: "media-source://media_source/local/alarms/alarm_oxygen_gentle.mp3"
  volume: 0.8
  fade_seconds: 30
  repeat_count: 0                 # 0 = continuous loop until dismissed
  snooze_minutes: 9
  auto_dismiss_minutes: 30
```

### Available Actions

| Action | Description |
|---|---|
| `wakey.create` | Create a new alarm with schedule and audio configuration |
| `wakey.update` | Update fields on an existing alarm by `alarm_id` |
| `wakey.delete` | Delete an alarm and remove its entities |
| `wakey.snooze` | Silence a ringing alarm for a set number of minutes |
| `wakey.dismiss` | Stop a ringing alarm until its next scheduled occurrence |
| `wakey.skip_next` | Skip only the next occurrence, then resume schedule |
| `wakey.adjust_next` | Move the next occurrence to a specific time (`clear: true` to undo) |
| `wakey.trigger_now` | Fire an alarm immediately for testing |

______________________________________________________________________

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=23&pause=1000&color=F7F7F7&vCenter=true&width=435&height=30&lines=ENTITIES+%26+EVENTS)](https://git.io/typing-svg)

### Entities Per Alarm
Each alarm creates its own Home Assistant device with:
- `switch.<name>`: Arm / disarm the alarm.
- `time.<name>_time`: Time selector editable from any dashboard or automation.
- `sensor.<name>_next`: Timestamp sensor of next scheduled fire time.
- `button.<name>_test`: Quick test button to verify audio output and volume.
- `switch.<name>_skip_next`: Toggle to skip the upcoming occurrence.

### Events

| Event | Description |
|---|---|
| `wakey_pre_alarm` | Fires when the pre-alarm lead time is reached |
| `wakey_alarm_fired` | Fires when the alarm begins ringing |
| `wakey_alarm_snoozed` | Fires when an alarm is snoozed |
| `wakey_alarm_dismissed` | Fires when an alarm is dismissed |
| `wakey_alarm_failed` | Fires if a media player fails to play after retries |

Example notification automation for failed playback:
```yaml
triggers:
  - trigger: event
    event_type: wakey_alarm_failed
actions:
  - action: notify.mobile_app_phone
    data:
      title: "Wakey Alarm Failed!"
      message: "Alarm {{ trigger.event.data.name }} failed to play on speaker."
```

______________________________________________________________________

<div align="center">

<p>Made with ❤️ from rhythmcreative.</p>

</div>
