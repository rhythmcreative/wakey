"""Ringing sensor, test button, skip-next switch, and the pre-alarm hook."""

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.wakey.const import DOMAIN

ALARM = {
    "name": "Weekday",
    "time": "06:30",
    "media_player": "media_player.bedroom",
    "source_uri": "library://track/6018",
    "weekdays": [0, 1, 2, 3, 4],
}


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    config_entry = MockConfigEntry(domain=DOMAIN, data={}, title="Wakey")
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry


async def _create(hass, **overrides):
    await hass.services.async_call(DOMAIN, "create", {**ALARM, **overrides}, blocking=True)
    await hass.async_block_till_done()


async def test_ringing_binary_sensor_exists_and_is_off(hass, entry) -> None:
    state = hass.states.get("binary_sensor.wakey_ringing")
    assert state is not None
    assert state.state == "off"
    assert state.attributes["ringing"] == []


async def test_test_button_created_per_alarm(hass, entry) -> None:
    await _create(hass)
    assert hass.states.get("button.weekday_test") is not None


async def test_skip_next_switch_is_registered_but_disabled_by_default(hass, entry) -> None:
    """Kept out of the way by default — the panel already exposes skip."""
    await _create(hass)
    registry = er.async_get(hass)
    data = hass.data[DOMAIN][entry.entry_id]
    alarm_id = data.store.async_all()[0].id

    entity_id = registry.async_get_entity_id("switch", DOMAIN, f"{alarm_id}_skip_next")
    assert entity_id is not None
    assert registry.async_get(entity_id).disabled_by is er.RegistryEntryDisabler.INTEGRATION
    # Disabled entities are absent from the state machine.
    assert hass.states.get(entity_id) is None


async def test_pre_alarm_timer_scheduled_when_configured(hass, entry) -> None:
    await _create(hass, pre_alarm_minutes=15, pre_alarm_script="script.sunrise")
    data = hass.data[DOMAIN][entry.entry_id]
    alarm_id = data.store.async_all()[0].id

    assert alarm_id in data.scheduler._timers
    assert alarm_id in data.scheduler._pre_timers


async def test_no_pre_alarm_timer_without_script(hass, entry) -> None:
    """Lead time alone is not enough — there has to be something to run."""
    await _create(hass, pre_alarm_minutes=15)
    data = hass.data[DOMAIN][entry.entry_id]
    alarm_id = data.store.async_all()[0].id

    assert alarm_id in data.scheduler._timers
    assert alarm_id not in data.scheduler._pre_timers


async def test_pre_alarm_runs_script_and_fires_event(hass, entry) -> None:
    await _create(hass, pre_alarm_minutes=15, pre_alarm_script="script.sunrise")
    data = hass.data[DOMAIN][entry.entry_id]
    alarm = data.store.async_all()[0]

    events = []
    hass.bus.async_listen(f"{DOMAIN}_pre_alarm", lambda e: events.append(e))

    calls = []
    hass.services.async_register("script", "turn_on", lambda call: calls.append(call))

    await data.player.async_run_pre_alarm(alarm)
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["name"] == "Weekday"
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == "script.sunrise"


async def test_diagnostics_include_computed_next_fire(hass, entry) -> None:
    from custom_components.wakey.diagnostics import async_get_config_entry_diagnostics

    await _create(hass)
    diag = await async_get_config_entry_diagnostics(hass, entry)

    assert diag["alarm_count"] == 1
    assert diag["alarms"][0]["computed_next_fire"] is not None
    assert len(diag["pending_timers"]) == 1
