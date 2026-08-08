"""Shared fixtures."""

import pytest
from homeassistant.auth.const import GROUP_ID_USER
from homeassistant.auth.models import Credentials
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import CLIENT_ID, MockUser

pytest_plugins = "pytest_homeassistant_custom_component"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Let Home Assistant see custom_components/wakey during tests."""
    yield


async def _make_user(hass: HomeAssistant, name: str) -> MockUser:
    """An ordinary non-admin household member.

    Deliberately the Users group rather than the bundled read-only fixture:
    read-only means "may not control anything at all", whereas the case these
    tests are about is a normal member who can operate entities but should
    only reach their own alarms.
    """
    group = await hass.auth.async_get_group(GROUP_ID_USER)
    return MockUser(name=name, groups=[group]).add_to_hass(hass)


async def _make_token(hass: HomeAssistant, user: MockUser, username: str) -> str:
    credential = Credentials(
        id=f"mock-{username}-credential",
        auth_provider_type="homeassistant",
        auth_provider_id=None,
        data={"username": username},
        is_new=False,
    )
    user.credentials.append(credential)
    refresh_token = await hass.auth.async_create_refresh_token(
        user, CLIENT_ID, credential=credential
    )
    return hass.auth.async_create_access_token(refresh_token)


@pytest.fixture
async def kid_user(hass: HomeAssistant, local_auth) -> MockUser:
    """The non-admin whose pranks this whole feature exists to stop."""
    return await _make_user(hass, "Kid")


@pytest.fixture
async def kid_token(hass: HomeAssistant, kid_user: MockUser, local_auth) -> str:
    return await _make_token(hass, kid_user, "kid")


@pytest.fixture
async def other_user(hass: HomeAssistant, local_auth) -> MockUser:
    """A second non-admin, so isolation between two of them is provable."""
    return await _make_user(hass, "Other")


@pytest.fixture
async def other_token(hass: HomeAssistant, other_user: MockUser, local_auth) -> str:
    return await _make_token(hass, other_user, "other")
