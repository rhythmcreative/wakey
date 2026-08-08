"""Who may see and change which alarms.

Every entry point — the WebSocket API, the services, and the per-alarm
entities — funnels through here, so there is exactly one definition of the
rules rather than twelve call sites that have to agree with each other.

The rules:

* Administrators see and do everything, including to unowned alarms.
* Everyone else sees and touches only alarms they own.
* Speakers are deny-by-default: a non-admin with no policy record may target
  no media players at all until an administrator grants some.

Deliberately not called auth.py — that reads confusingly next to
homeassistant.auth.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import callback

from .const import ATTR_OWNER_ID, ERR_NOT_FOUND, ERR_PLAYER_NOT_ALLOWED
from .store import AlarmEntry, WakeyStore


class WakeyPermissionError(Exception):
    """Base for Wakey access denials, carrying a WebSocket error code."""

    code = ERR_NOT_FOUND


class AlarmNotVisible(WakeyPermissionError):
    """The caller may not see this alarm.

    Reported as not_found rather than unauthorized on purpose: a non-admin
    should not be able to probe for other people's alarm ids by watching which
    error comes back.
    """

    code = ERR_NOT_FOUND

    def __init__(self, alarm_id: str) -> None:
        super().__init__(f"No alarm with id {alarm_id}")


class PlayerNotAllowed(WakeyPermissionError):
    """The caller may not target this speaker."""

    code = ERR_PLAYER_NOT_ALLOWED

    def __init__(self, entity_id: str, allowed: list[str]) -> None:
        self.entity_id = entity_id
        self.allowed = allowed
        if allowed:
            detail = f"You may only use: {', '.join(allowed)}"
        else:
            detail = "An administrator has not given you access to any speakers"
        super().__init__(f"{entity_id or 'No speaker'} is not available to you. {detail}")


@callback
def async_can_see(alarm: AlarmEntry, user_id: str | None, is_admin: bool) -> bool:
    """Admins see everything, including unowned alarms. Others see only theirs."""
    if is_admin:
        return True
    return user_id is not None and alarm.owner_id == user_id


@callback
def async_visible_alarms(
    store: WakeyStore, user_id: str | None, is_admin: bool
) -> list[AlarmEntry]:
    if is_admin:
        return store.async_all()
    return [a for a in store.async_all() if async_can_see(a, user_id, is_admin)]


@callback
def async_allowed_players(
    store: WakeyStore, user_id: str | None, is_admin: bool
) -> list[str] | None:
    """The speakers this caller may use. None means unrestricted.

    An empty list is meaningfully different from None: it means "explicitly
    nothing", which is what a non-admin gets before an administrator grants
    them anything.

    Note there is no "no user id" escape hatch here. A service call with no
    user is a system call and already arrives with is_admin=True; a WebSocket
    connection with no user is not something that should happen, and if it
    ever did it lands in the deny branch rather than the unrestricted one.
    """
    if is_admin:
        return None
    if user_id is None:
        return []
    policy = store.async_get_policy(user_id)
    return list(policy.allowed_media_players) if policy else []


@callback
def async_assert_player_allowed(
    store: WakeyStore, user_id: str | None, is_admin: bool, entity_id: str
) -> None:
    """Raise PlayerNotAllowed unless this caller may target this speaker."""
    allowed = async_allowed_players(store, user_id, is_admin)
    if allowed is None:
        return
    # An empty entity_id is not in anyone's allowlist, which is the behaviour
    # we want: a restricted user must choose a speaker they were granted.
    if entity_id not in allowed:
        raise PlayerNotAllowed(entity_id, allowed)


@callback
def async_assert_can_modify(
    store: WakeyStore, alarm_id: str, user_id: str | None, is_admin: bool
) -> AlarmEntry:
    """Return the alarm, or raise if the caller may not see it."""
    alarm = store.async_get(alarm_id)
    if alarm is None or not async_can_see(alarm, user_id, is_admin):
        raise AlarmNotVisible(alarm_id)
    return alarm


@callback
def async_sanitize_payload(payload: dict[str, Any], is_admin: bool) -> dict[str, Any]:
    """Strip fields a non-admin may not set.

    owner_id is the one that matters. AlarmEntry.from_dict accepts it happily
    and WakeyStore.async_update's hasattr() loop would apply it, so without
    this a non-admin could hand alarms to other people — or quietly take one.
    Ownership changes go through the admin-only wakey/set_owner instead.
    """
    if is_admin:
        return payload
    return {k: v for k, v in payload.items() if k != ATTR_OWNER_ID}


@callback
def async_visible_ringing(
    store: WakeyStore, player, user_id: str | None, is_admin: bool
) -> list[str]:
    """Currently-ringing alarm ids this caller is allowed to silence.

    The untargeted "snooze whatever is going off" means "whatever of mine is
    going off" for a non-admin. Dismissing someone else's alarm is a prank of
    the same family as setting one.
    """
    ids = []
    for alarm_id in list(player.ringing):
        alarm = store.async_get(alarm_id)
        if alarm is not None and async_can_see(alarm, user_id, is_admin):
            ids.append(alarm_id)
    return ids


@callback
def async_orphaned_alarms(
    store: WakeyStore, user_id: str, allowed_media_players: list[str]
) -> list[AlarmEntry]:
    """That user's alarms whose speaker a new policy would no longer permit.

    Reported to the administrator rather than acted on. Silently disabling
    someone's alarm clock is a worse outcome than an inconsistent policy.
    """
    return [
        alarm
        for alarm in store.async_for_owner(user_id)
        if alarm.media_player not in allowed_media_players
    ]
