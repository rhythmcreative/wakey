#!/usr/bin/env bash
# Follows Home Assistant's log, filtered to Wakey.
#
# Note: there is no live /config/home-assistant.log on a default HA OS install
# (only rotated archives), so this goes through the `ha` CLI.
set -euo pipefail

HOST="${1:-${WAKEY_HOST:-}}"

if [ -z "$HOST" ]; then
  echo "Usage: $0 ssh-host-or-alias   (or set WAKEY_HOST)" >&2
  exit 1
fi

ssh "$HOST" 'ha core logs --follow' | grep --line-buffered -iE 'wakey|Traceback'
