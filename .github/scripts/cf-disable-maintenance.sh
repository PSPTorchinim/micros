#!/usr/bin/env bash
set -euo pipefail
ENV_SLUG="$1"; ACCOUNT_ID="$2"; CF_EMAIL="$3"; CF_KEY="$4"; ZONE_ID="$5"
PATTERN="*${ENV_SLUG}*.djbeatblaster.com/*"
ROUTES=$(curl -sS -X GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}")
RID=$(echo "$ROUTES" | jq -r ".result[]? | select(.pattern == \"$PATTERN\")? | .id // empty")
if [ -n "$RID" ]; then
  curl -sS -X DELETE "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes/${RID}" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" >/dev/null || true
fi
# best-effort delete shared worker (pattern-specific workers were named with app, so nothing global to delete)
