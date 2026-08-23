"""Which service actually plays the alarm.

source_kind=music_assistant is what the panel stores by default, but calling
music_assistant.play_media is only correct when Music Assistant is installed,
owns the target player, and can resolve the source. Everything else must fall
back to plain media_player.play_media — the silent failure mode here was a
Cast speaker that chirped and never played (issue #9).
"""

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)

from custom_components.wakey.const import DOMAIN

ALARM = {
    "name": "Weekday",
    "time": "06:30",
    "media_player": "media_player.bedroom",
    "source_uri": "library://track/6018",
}


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    config_entry = MockConfigEntry(domain=DOMAIN, data={}, title="Wakey")
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry


def _data(hass):
    return next(iter(hass.data[DOMAIN].values()))


def _mock_players(hass, with_ma: bool = True):
    calls = {
        "generic": async_mock_service(hass, "media_player", "play_media"),
        "volume_set": async_mock_service(hass, "media_player", "volume_set"),
        "turn_on": async_mock_service(hass, "media_player", "turn_on"),
    }
    if with_ma:
        calls["ma"] = async_mock_service(hass, "music_assistant", "play_media")
    return calls


async def _fire(hass, **overrides):
    data = _data(hass)
    alarm = data.store.async_create({**ALARM, **overrides})
    hass.states.async_set(alarm.media_player, "idle")
    await data.player.async_fire(alarm)
    await hass.async_block_till_done()
    return alarm


async def test_ma_uri_on_unregistered_player_uses_music_assistant(hass, entry) -> None:
    """The original path still holds when nothing says the player isn't MA's."""
    calls = _mock_players(hass)

    await _fire(hass)

    assert len(calls["ma"]) == 1
    assert not calls["generic"]


async def test_media_source_uri_bypasses_music_assistant(hass, entry) -> None:
    """A browsed pick from HA's media sources is nothing MA can resolve."""
    calls = _mock_players(hass)
    uri = "media-source://media_source/local/song.mp3"

    await _fire(hass, source_uri=uri)

    assert not calls["ma"]
    assert calls["generic"][0].data["media_content_id"] == uri


async def test_foreign_platform_player_bypasses_music_assistant(hass, entry) -> None:
    """MA's services only match MA's own entities; a Cast target must not
    be handed to them."""
    registry = er.async_get(hass)
    reg_entry = registry.async_get_or_create(
        "media_player", "cast", "mini-uuid", suggested_object_id="kitchen_mini"
    )
    calls = _mock_players(hass)

    await _fire(hass, media_player=reg_entry.entity_id)

    assert not calls["ma"]
    assert calls["generic"][0].data["media_content_id"] == ALARM["source_uri"]


async def test_ma_platform_player_uses_music_assistant(hass, entry) -> None:
    registry = er.async_get(hass)
    reg_entry = registry.async_get_or_create(
        "media_player", "music_assistant", "ma-uuid", suggested_object_id="office"
    )
    calls = _mock_players(hass)

    await _fire(hass, media_player=reg_entry.entity_id)

    assert len(calls["ma"]) == 1
    assert not calls["generic"]


async def test_missing_music_assistant_falls_back(hass, entry) -> None:
    """No MA installed: the call would raise ServiceNotFound and the alarm
    would stay silent."""
    calls = _mock_players(hass, with_ma=False)

    await _fire(hass)

    assert calls["generic"][0].data["media_content_id"] == ALARM["source_uri"]
