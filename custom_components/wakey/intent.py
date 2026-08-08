"""Voice snooze/cancel for Wakey via Home Assistant's Assist pipeline.

Deliberately global, not scoped to a specific alarm or satellite: any Assist
satellite in the house can snooze or dismiss whatever alarm is currently
ringing, regardless of whose alarm it is or which room it's in — the same way
a smart speaker's own "stop"/"snooze" isn't tied to which device set the
alarm off.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

INTENT_SNOOZE = "WakeySnooze"
INTENT_DISMISS = "WakeyDismiss"

# HA's default conversation agent only matches sentences from two places: the
# bundled upstream home-assistant-intents package (an upstream PR, not
# reachable from here), or <config>/custom_sentences/<language>/*.yaml — a
# directory in the user's own config, not this integration's folder. So Wakey
# writes its own file there at setup rather than shipping sentences in-repo.
_SENTENCES = """\
# Managed by the Wakey integration — do not edit here.
# Add your own phrasings in a separate file in this directory; the
# conversation agent merges every *.yaml file it finds.
language: "en"
intents:
  WakeySnooze:
    data:
      - sentences:
          - "snooze"
          - "snooze [the] alarm"
  WakeyDismiss:
    data:
      - sentences:
          - "cancel"
          - "cancel [the] alarm"
          - "stop [the] alarm"
          - "dismiss [the] alarm"
"""


def _get_data(hass: HomeAssistant):
    return next(iter(hass.data.get(DOMAIN, {}).values()), None)


class _WakeySnoozeIntent(intent.IntentHandler):
    intent_type = INTENT_SNOOZE
    description = "Snooze whatever Wakey alarm is currently ringing"

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        if (data := _get_data(intent_obj.hass)) is not None:
            await data.player.async_snooze_all()
        response = intent_obj.create_response()
        response.async_set_speech("")
        return response


class _WakeyDismissIntent(intent.IntentHandler):
    intent_type = INTENT_DISMISS
    description = "Dismiss whatever Wakey alarm is currently ringing"

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        if (data := _get_data(intent_obj.hass)) is not None:
            await data.player.async_dismiss_all()
        response = intent_obj.create_response()
        response.async_set_speech("")
        return response


async def async_setup_intents(hass: HomeAssistant) -> None:
    """Register the snooze/dismiss intents and seed their trigger sentences."""
    intent.async_register(hass, _WakeySnoozeIntent())
    intent.async_register(hass, _WakeyDismissIntent())

    path = Path(hass.config.path("custom_sentences", "en", f"{DOMAIN}.yaml"))

    def _write_sentences() -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        # Only touch disk (and the sentence corpus reload it may trigger) if
        # the content actually changed.
        if not path.exists() or path.read_text() != _SENTENCES:
            path.write_text(_SENTENCES)

    await hass.async_add_executor_job(_write_sentences)


def async_remove_intents(hass: HomeAssistant) -> None:
    """Unregister the snooze/dismiss intents. The sentence file is left in place."""
    intent.async_remove(hass, INTENT_SNOOZE)
    intent.async_remove(hass, INTENT_DISMISS)
