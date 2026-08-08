"""Storage schema 1.0 -> 1.1: alarms gained an owner, and policies appeared."""

from custom_components.wakey.store import (
    STORAGE_KEY,
    STORAGE_VERSION_MAJOR,
    STORAGE_VERSION_MINOR,
    UserPolicy,
    WakeyStore,
)

V1_0_ALARM = {
    "id": "abc123",
    "name": "Weekday",
    "time": "06:30",
    "media_player": "media_player.bedroom",
    "source_uri": "library://track/6018",
    "weekdays": [0, 1, 2, 3, 4],
    "volume": 0.7,
    "fade_seconds": 60,
}


def _seed(hass_storage, data, minor_version=0):
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": minor_version,
        "key": STORAGE_KEY,
        "data": data,
    }


async def test_v1_0_alarms_load_as_unowned(hass, hass_storage) -> None:
    """They keep firing; they just become admin-only until assigned."""
    _seed(hass_storage, {"alarms": [V1_0_ALARM]})

    store = WakeyStore(hass)
    await store.async_load()

    alarm = store.async_get("abc123")
    assert alarm is not None
    assert alarm.owner_id is None
    # Nothing else about the alarm may drift during the migration.
    assert alarm.time == "06:30"
    assert alarm.media_player == "media_player.bedroom"
    assert alarm.volume == 0.7
    assert alarm.fade_seconds == 60


async def test_v1_0_gains_an_empty_policy_set(hass, hass_storage) -> None:
    _seed(hass_storage, {"alarms": [V1_0_ALARM]})

    store = WakeyStore(hass)
    await store.async_load()

    assert store.policies == {}


async def test_migrated_file_is_rewritten_at_the_new_version(hass, hass_storage) -> None:
    _seed(hass_storage, {"alarms": [V1_0_ALARM]})

    store = WakeyStore(hass)
    await store.async_load()
    await store.async_save_now()

    written = hass_storage[STORAGE_KEY]
    assert written["version"] == STORAGE_VERSION_MAJOR
    assert written["minor_version"] == STORAGE_VERSION_MINOR
    assert written["data"]["alarms"][0]["owner_id"] is None
    assert written["data"]["policies"] == {}


async def test_storage_from_before_the_public_release_is_discarded(
    hass, hass_storage
) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": 0,
        "minor_version": 9,
        "key": STORAGE_KEY,
        "data": {"alarms": [V1_0_ALARM]},
    }

    store = WakeyStore(hass)
    await store.async_load()

    assert store.async_all() == []
    assert store.policies == {}


async def test_owner_and_policies_round_trip(hass, hass_storage) -> None:
    _seed(
        hass_storage,
        {
            "alarms": [{**V1_0_ALARM, "owner_id": "user-1"}],
            "policies": {
                "user-1": {
                    "user_id": "user-1",
                    "allowed_media_players": ["media_player.kids_room"],
                }
            },
        },
        minor_version=STORAGE_VERSION_MINOR,
    )

    store = WakeyStore(hass)
    await store.async_load()

    assert store.async_get("abc123").owner_id == "user-1"
    assert store.async_get_policy("user-1") == UserPolicy(
        user_id="user-1", allowed_media_players=["media_player.kids_room"]
    )


async def test_a_stored_policy_is_re_filtered_on_load(hass, hass_storage) -> None:
    """Hand-edited storage does not get to smuggle in a non-speaker."""
    _seed(
        hass_storage,
        {
            "alarms": [],
            "policies": {
                "user-1": {
                    "user_id": "user-1",
                    "allowed_media_players": ["light.kitchen", "media_player.den"],
                }
            },
        },
        minor_version=STORAGE_VERSION_MINOR,
    )

    store = WakeyStore(hass)
    await store.async_load()

    assert store.async_get_policy("user-1").allowed_media_players == [
        "media_player.den"
    ]
