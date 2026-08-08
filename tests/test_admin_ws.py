"""The admin API behind the panel's permissions screen."""

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.wakey.const import DOMAIN

KIDS_ROOM = "media_player.kids_room"
BEDROOM = "media_player.bedroom"

ALARM = {
    "name": "Weekday",
    "time": "06:30",
    "media_player": BEDROOM,
    "source_uri": "library://track/6018",
}


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    config_entry = MockConfigEntry(domain=DOMAIN, data={}, title="Wakey")
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry


def _store(hass):
    return next(iter(hass.data[DOMAIN].values())).store


# --- users -----------------------------------------------------------------


async def test_users_list_returns_the_household(
    hass, entry, hass_ws_client, kid_user, hass_admin_user
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "wakey/users/list"})
    users = (await client.receive_json())["result"]["users"]

    by_id = {u["id"]: u for u in users}
    assert by_id[kid_user.id]["name"] == "Kid"
    assert by_id[kid_user.id]["is_admin"] is False
    assert by_id[hass_admin_user.id]["is_admin"] is True


async def test_users_list_excludes_machine_accounts(
    hass, entry, hass_ws_client, hass_supervisor_user
) -> None:
    """Supervisor and friends would only clutter the permission matrix."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "wakey/users/list"})
    users = (await client.receive_json())["result"]["users"]

    assert hass_supervisor_user.id not in {u["id"] for u in users}


# --- policies --------------------------------------------------------------


async def test_policy_set_then_list_round_trips(
    hass, entry, hass_ws_client, kid_user
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "wakey/policy/set",
            "user_id": kid_user.id,
            "allowed_media_players": [KIDS_ROOM],
        }
    )
    assert (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "wakey/policy/list"})
    policies = (await client.receive_json())["result"]["policies"]

    assert policies[kid_user.id]["allowed_media_players"] == [KIDS_ROOM]


async def test_policy_set_rejects_a_non_media_player(
    hass, entry, hass_ws_client, kid_user
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "wakey/policy/set",
            "user_id": kid_user.id,
            "allowed_media_players": ["light.kitchen"],
        }
    )
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_format"


async def test_policy_set_rejects_an_unknown_user(hass, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "wakey/policy/set",
            "user_id": "nope",
            "allowed_media_players": [KIDS_ROOM],
        }
    )
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"


async def test_policy_set_reports_but_does_not_disable_orphaned_alarms(
    hass, entry, hass_ws_client, kid_user
) -> None:
    """Silently switching off someone's alarm clock is the worst outcome."""
    orphan = _store(hass).async_create(
        {**ALARM, "name": "School", "owner_id": kid_user.id}
    )

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "wakey/policy/set",
            "user_id": kid_user.id,
            "allowed_media_players": [KIDS_ROOM],
        }
    )
    result = (await client.receive_json())["result"]

    assert result["orphaned_alarms"] == [
        {"id": orphan.id, "name": "School", "media_player": BEDROOM}
    ]
    assert _store(hass).async_get(orphan.id).enabled is True


async def test_policy_delete_reverts_to_deny_by_default(
    hass, entry, hass_ws_client, kid_user
) -> None:
    _store(hass).async_set_policy(kid_user.id, [KIDS_ROOM])

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "wakey/policy/delete", "user_id": kid_user.id}
    )
    assert (await client.receive_json())["success"]

    assert _store(hass).async_get_policy(kid_user.id) is None


# --- ownership -------------------------------------------------------------


async def test_admin_can_assign_an_unowned_alarm(
    hass, entry, hass_ws_client, kid_user
) -> None:
    legacy = _store(hass).async_create({**ALARM})
    assert legacy.owner_id is None

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "wakey/set_owner", "alarm_id": legacy.id, "owner_id": kid_user.id}
    )
    assert (await client.receive_json())["success"]

    assert _store(hass).async_get(legacy.id).owner_id == kid_user.id


async def test_set_owner_null_unassigns(hass, entry, hass_ws_client, kid_user) -> None:
    alarm = _store(hass).async_create({**ALARM, "owner_id": kid_user.id})

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "wakey/set_owner", "alarm_id": alarm.id, "owner_id": None}
    )
    assert (await client.receive_json())["success"]

    assert _store(hass).async_get(alarm.id).owner_id is None


async def test_set_owner_rejects_unknown_alarm_and_user(
    hass, entry, hass_ws_client, kid_user
) -> None:
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "wakey/set_owner", "alarm_id": "nope", "owner_id": kid_user.id}
    )
    assert (await client.receive_json())["error"]["code"] == "not_found"

    alarm = _store(hass).async_create({**ALARM})
    await client.send_json_auto_id(
        {"type": "wakey/set_owner", "alarm_id": alarm.id, "owner_id": "nobody"}
    )
    assert (await client.receive_json())["error"]["code"] == "not_found"


# --- everything above is admin-only ----------------------------------------


@pytest.mark.parametrize(
    ("command", "extra"),
    [
        ("wakey/users/list", {}),
        ("wakey/policy/list", {}),
        ("wakey/policy/set", {"user_id": "x", "allowed_media_players": []}),
        ("wakey/policy/delete", {"user_id": "x"}),
        ("wakey/set_owner", {"alarm_id": "x", "owner_id": None}),
    ],
)
async def test_admin_commands_refuse_non_admins(
    hass, entry, hass_ws_client, kid_token, command, extra
) -> None:
    client = await hass_ws_client(hass, kid_token)
    await client.send_json_auto_id({"type": command, **extra})
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "unauthorized"
