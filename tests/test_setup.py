"""End-to-end integration setup, services and dynamic entities."""

from datetime import time

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.wakey.const import DOMAIN


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    config_entry = MockConfigEntry(domain=DOMAIN, data={}, title="Wakey")
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry


async def test_setup_registers_services(hass: HomeAssistant, entry) -> None:
    for service in (
        "create",
        "update",
        "delete",
        "snooze",
        "dismiss",
        "skip_next",
        "trigger_now",
    ):
        assert hass.services.has_service(DOMAIN, service), service


async def test_global_sensor_exists_with_no_alarms(hass: HomeAssistant, entry) -> None:
    state = hass.states.get("sensor.wakey_next_alarm")
    assert state is not None
    assert state.state == "unknown"
    assert state.attributes["total_alarms"] == 0


async def test_create_service_spawns_entities(hass: HomeAssistant, entry) -> None:
    """Alarms created at runtime must get entities without a restart."""
    await hass.services.async_call(
        DOMAIN,
        "create",
        {
            "name": "Weekday",
            "time": "06:30",
            "media_player": "media_player.bedroom",
            "source_uri": "library://track/6018",
            "weekdays": [0, 1, 2, 3, 4],
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    data = hass.data[DOMAIN][entry.entry_id]
    assert len(data.store.async_all()) == 1
    alarm = data.store.async_all()[0]

    switch = hass.states.get("switch.weekday")
    assert switch is not None
    assert switch.state == "on"
    assert switch.attributes["time"] == "06:30"

    assert hass.states.get("time.weekday_time").state == "06:30:00"
    assert hass.states.get("sensor.weekday_next").state not in (None, "unknown")

    glob = hass.states.get("sensor.wakey_next_alarm")
    assert glob.attributes["total_alarms"] == 1
    assert glob.attributes["alarm_id"] == alarm.id


async def test_disabling_clears_next_fire(hass: HomeAssistant, entry) -> None:
    await hass.services.async_call(
        DOMAIN,
        "create",
        {
            "name": "Weekday",
            "time": "06:30",
            "media_player": "media_player.bedroom",
            "source_uri": "x",
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    await hass.services.async_call(
        "switch", "turn_off", {"entity_id": "switch.weekday"}, blocking=True
    )
    await hass.async_block_till_done()

    assert hass.states.get("switch.weekday").state == "off"
    assert hass.states.get("sensor.weekday_next").state == "unknown"


async def test_time_entity_writes_through_to_store(hass: HomeAssistant, entry) -> None:
    """Editing the time entity must update the store, not just the entity."""
    await hass.services.async_call(
        DOMAIN,
        "create",
        {
            "name": "Weekday",
            "time": "06:30",
            "media_player": "media_player.bedroom",
            "source_uri": "x",
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    await hass.services.async_call(
        "time",
        "set_value",
        {"entity_id": "time.weekday_time", "time": time(5, 45)},
        blocking=True,
    )
    await hass.async_block_till_done()

    data = hass.data[DOMAIN][entry.entry_id]
    assert data.store.async_all()[0].time == "05:45"
    assert hass.states.get("time.weekday_time").state == "05:45:00"
    assert hass.states.get("switch.weekday").attributes["time"] == "05:45"


async def test_skip_next_service_sets_flag(hass: HomeAssistant, entry) -> None:
    await hass.services.async_call(
        DOMAIN,
        "create",
        {
            "name": "Weekday",
            "time": "06:30",
            "media_player": "media_player.bedroom",
            "source_uri": "x",
        },
        blocking=True,
    )
    await hass.async_block_till_done()
    data = hass.data[DOMAIN][entry.entry_id]
    alarm_id = data.store.async_all()[0].id

    before = hass.states.get("sensor.weekday_next").state

    await hass.services.async_call(
        DOMAIN, "skip_next", {"alarm_id": alarm_id}, blocking=True
    )
    await hass.async_block_till_done()

    assert data.store.async_get(alarm_id).skip_next is True
    assert hass.states.get("sensor.weekday_next").state != before


async def test_delete_removes_entities(hass: HomeAssistant, entry) -> None:
    await hass.services.async_call(
        DOMAIN,
        "create",
        {
            "name": "Weekday",
            "time": "06:30",
            "media_player": "media_player.bedroom",
            "source_uri": "x",
        },
        blocking=True,
    )
    await hass.async_block_till_done()
    data = hass.data[DOMAIN][entry.entry_id]
    alarm_id = data.store.async_all()[0].id

    await hass.services.async_call(
        DOMAIN, "delete", {"alarm_id": alarm_id}, blocking=True
    )
    await hass.async_block_till_done()

    assert data.store.async_get(alarm_id) is None
    assert hass.states.get("switch.weekday") is None
    assert hass.states.get("time.weekday_time") is None


async def test_unload(hass: HomeAssistant, entry) -> None:
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert not hass.services.has_service(DOMAIN, "create")
