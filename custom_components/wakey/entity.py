"""Shared base for Wakey entities."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME, SIGNAL_ALARMS_CHANGED, SIGNAL_RUNTIME_CHANGED, VERSION
from .permissions import async_can_see
from .store import AlarmEntry


class WakeyAlarmEntity(Entity):
    """Base for entities that belong to a single alarm.

    Each alarm is its own device, so its switch/time/sensor group together in
    the UI. All state is read live from the store — these entities never hold
    their own copy, which is what keeps them from drifting out of sync with
    the panel.
    """

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, data, alarm_id: str) -> None:
        self._data = data
        self._alarm_id = alarm_id
        alarm = data.store.async_get(alarm_id)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, alarm_id)},
            name=alarm.name if alarm else NAME,
            manufacturer=NAME,
            model="Alarm",
            sw_version=VERSION,
        )

    @property
    def alarm(self) -> AlarmEntry | None:
        return self._data.store.async_get(self._alarm_id)

    @property
    def available(self) -> bool:
        return self.alarm is not None

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_ALARMS_CHANGED, self._handle_update
            )
        )
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_RUNTIME_CHANGED, self._handle_update
            )
        )

    async def async_assert_may_control(self) -> None:
        """Refuse to act on an alarm the calling user may not see.

        switch.<alarm>, time.<alarm>_time and button.<alarm>_test are ordinary
        entities, so they appear on every household member's auto-generated
        dashboard. Without this they would be an unguarded way around the
        panel's ownership rules — pressing Test on someone else's alarm is the
        whole prank this feature exists to stop.

        homeassistant.helpers.service sets the entity's context before every
        entity service call, so context.user_id is the person who pressed the
        button. It is None for automations, scripts and startup, which are
        allowed through unchanged. If a context ever went stale the effect
        would be to deny an automation, never to allow a stranger — it fails
        in the safe direction.
        """
        context = self._context
        user_id = context.user_id if context else None
        if user_id is None:
            return

        alarm = self.alarm
        if alarm is None:
            return

        user = await self.hass.auth.async_get_user(user_id)
        is_admin = bool(user and user.is_admin)
        if not async_can_see(alarm, user_id, is_admin):
            raise Unauthorized(context=context, entity_id=self.entity_id)

    @callback
    def _handle_update(self, *_args) -> None:
        # Must be a @callback: async_dispatcher_connect runs undecorated
        # functions in an executor thread, and async_write_ha_state is not
        # thread safe.
        self.async_write_ha_state()
