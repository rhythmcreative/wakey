"""Sidebar panel registration."""

from __future__ import annotations

import logging
import os

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    CUSTOM_COMPONENTS,
    DOMAIN,
    INTEGRATION_FOLDER,
    PANEL_FILENAME,
    PANEL_FOLDER,
    PANEL_ICON,
    PANEL_NAME,
    PANEL_TITLE,
    PANEL_URL,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

_STATIC_REGISTERED = f"{DOMAIN}_static_registered"


async def async_register_panel(hass: HomeAssistant) -> None:
    """Serve the panel JS and put Wakey in the sidebar."""
    view_path = hass.config.path(
        CUSTOM_COMPONENTS, INTEGRATION_FOLDER, PANEL_FOLDER, PANEL_FILENAME
    )

    if not os.path.exists(view_path):
        _LOGGER.error(
            "Panel bundle missing at %s — the sidebar panel will not be available. "
            "This usually means the frontend was not built before deploying",
            view_path,
        )
        return

    try:
        cache_bust = int(os.path.getmtime(view_path))
    except OSError:
        cache_bust = 0

    # Registering the same URL twice makes aiohttp raise
    # "Added route will never be executed", so this is guarded rather than
    # repeated on every config-entry reload.
    if not hass.data.get(_STATIC_REGISTERED):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(PANEL_URL, view_path, cache_headers=False)]
        )
        hass.data[_STATIC_REGISTERED] = True

    # panel_custom.async_register_panel has no "update" flag, and the
    # underlying frontend call raises ValueError when a panel of the same
    # name already exists — so drop it first to stay reload-safe.
    frontend.async_remove_panel(hass, DOMAIN, warn_if_unknown=False)

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_NAME,
        frontend_url_path=DOMAIN,
        module_url=f"{PANEL_URL}?v={VERSION}&m={cache_bust}",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        # Deliberately not admin-only: an alarm clock is a household tool,
        # not a settings screen.
        require_admin=False,
        config={},
        config_panel_domain=DOMAIN,
    )
    _LOGGER.debug("Registered Wakey panel at /%s", DOMAIN)


def async_unregister_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, DOMAIN, warn_if_unknown=False)
