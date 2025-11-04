#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")" && pwd)
. "$ROOT/cf-common.sh"

HTML_PATH="$1"; EXTERNAL_MAP_RAW="${2:-}"; ENV_SLUG="$3"; ACCOUNT_ID="$4"; CF_EMAIL="$5"; CF_KEY="$6"; ZONE_ID="$7"
EXTERNAL_MAP=$(normalize_external_map "$EXTERNAL_MAP_RAW")

# Take first 3 apps
APP_NAMES=$(echo "$EXTERNAL_MAP" | jq -r 'to_entries | .[:3] | map(.value | split(":")[0]) | .[]')

MAINTENANCE_HTML=$(jq -Rs . < "$HTML_PATH")

for APP in $APP_NAMES; do
  WORKER_NAME="maintenance-page-${ENV_SLUG}-${APP}"
  PATTERN="dj-panel-${ENV_SLUG}-${APP}.djbeatblaster.com/*"
  cat > /tmp/worker-script.js <<EOF
    addEventListener('fetch', event => { event.respondWith(new Response($MAINTENANCE_HTML,{status:503,headers:{'Content-Type':'text/html;charset=UTF-8','Cache-Control':'no-store, no-cache, must-revalidate, proxy-revalidate','Retry-After':'120'}})) })
  EOF
  curl -sS -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
    -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" -H "Content-Type: application/javascript" \
    --data-binary @/tmp/worker-script.js >/dev/null
  # upsert route
  ROUTES=$(curl -s "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}")
  RID=$(echo "$ROUTES" | jq -r ".result[]? | select(.pattern == \"$PATTERN\")? | .id // empty")
  BODY=$(jq -n --arg pattern "$PATTERN" --arg script "$WORKER_NAME" '{pattern:$pattern,script:$script}')
  if [ -n "$RID" ]; then
    curl -sS -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes/${RID}" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" -H "Content-Type: application/json" --data "$BODY" >/dev/null
  else
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" -H "Content-Type: application/json" --data "$BODY" >/dev/null
  fi
  echo "Enabled maintenance for $PATTERN"
done
