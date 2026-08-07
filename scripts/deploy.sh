#!/usr/bin/env bash
# Copies custom_components/wakey to a Home Assistant host's /config.
#
# Uses tar-over-ssh rather than rsync: the Terminal & SSH add-on's Alpine
# container ships neither rsync nor docker. The remote directory is emptied
# first so files deleted locally actually disappear and stale .pyc can't
# shadow a module that no longer exists.
#
# Usage: ./scripts/deploy.sh [ssh-host-or-alias]
set -euo pipefail

HOST="${1:-${WAKEY_HOST:-}}"
REMOTE="/config/custom_components/wakey"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -z "$HOST" ]; then
  echo "Usage: $0 ssh-host-or-alias   (or set WAKEY_HOST)" >&2
  exit 1
fi

echo "==> deploying to $HOST:$REMOTE"
ssh "$HOST" "mkdir -p '$REMOTE'"

tar czf - -C "$ROOT/custom_components/wakey" \
      --exclude '__pycache__' --exclude '*.pyc' . \
  | ssh "$HOST" "rm -rf '$REMOTE'/* 2>/dev/null || true; tar xzf - -C '$REMOTE'"

echo "==> deployed. Python changed? Restart is required:"
echo "    ssh $HOST 'ha core restart'"
echo "    (homeassistant.reload_config_entry re-runs setup with the OLD code)"
