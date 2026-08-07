"""Storage behaviour."""

from unittest.mock import patch

from custom_components.wakey.store import AlarmEntry, WakeyStore, coerce


async def test_create_assigns_id_and_persists(hass):
    store = WakeyStore(hass)
    await store.async_load()

    alarm = store.async_create({"name": "Wake up", "time": "6:5", "media_player": "media_player.x"})

    assert alarm.id
    assert alarm.name == "Wake up"
    assert alarm.time == "06:05"  # normalised
    assert store.async_get(alarm.id) is alarm
    assert len(store.async_all()) == 1


async def test_update_changes_value(hass):
    store = WakeyStore(hass)
    await store.async_load()
    alarm = store.async_create({"time": "07:00"})

    store.async_update(alarm.id, {"time": "08:15"})

    assert store.async_get(alarm.id).time == "08:15"


async def test_noop_update_does_not_dispatch(hass):
    """Guards the time-entity feedback loop.

    The time entity writes back on every change signal. If a write with an
    unchanged value still dispatched, entity and store would ping-pong.
    """
    store = WakeyStore(hass)
    await store.async_load()
    alarm = store.async_create({"time": "07:00"})

    with patch("custom_components.wakey.store.async_dispatcher_send") as dispatch:
        store.async_update(alarm.id, {"time": "07:00"})
        assert dispatch.call_count == 0

        store.async_update(alarm.id, {"time": "07:30"})
        assert dispatch.call_count == 1


async def test_update_unknown_alarm_returns_none(hass):
    store = WakeyStore(hass)
    await store.async_load()
    assert store.async_update("nope", {"time": "07:00"}) is None


async def test_delete(hass):
    store = WakeyStore(hass)
    await store.async_load()
    alarm = store.async_create({})

    assert store.async_delete(alarm.id) is True
    assert store.async_get(alarm.id) is None
    assert store.async_delete(alarm.id) is False


async def test_reload_from_disk_round_trips(hass):
    store = WakeyStore(hass)
    await store.async_load()
    alarm = store.async_create({"name": "Weekday", "time": "06:30", "weekdays": [0, 2, 4]})
    await store.async_save_now()

    reloaded = WakeyStore(hass)
    await reloaded.async_load()

    assert len(reloaded.async_all()) == 1
    assert reloaded.async_get(alarm.id).name == "Weekday"
    assert reloaded.async_get(alarm.id).weekdays == [0, 2, 4]


# --- coerce ----------------------------------------------------------------


def test_coerce_clamps_volume():
    """A bug that sets volume 1.0 on a bedroom speaker at 06:30 is memorable."""
    assert coerce({"volume": 5})["volume"] == 1.0
    assert coerce({"volume": -3})["volume"] == 0.0
    assert coerce({"volume": "loud"})["volume"] == 0.7


def test_coerce_rejects_bad_enums():
    assert coerce({"repeat": "hourly"})["repeat"] == "weekly"
    assert coerce({"source_kind": "gramophone"})["source_kind"] == "music_assistant"


def test_coerce_dedupes_and_bounds_weekdays():
    assert coerce({"weekdays": [1, 1, 3, 9, -2]})["weekdays"] == [1, 3]


def test_coerce_drops_unparseable_time():
    assert "time" not in coerce({"time": "quarter past"})


def test_from_dict_ignores_unknown_keys():
    alarm = AlarmEntry.from_dict({"id": "a", "name": "x", "bogus": 1})
    assert alarm.id == "a"
    assert not hasattr(alarm, "bogus")
