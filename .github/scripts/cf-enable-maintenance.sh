#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")" && pwd)
. "$ROOT/cf-common.sh"

HTML_PATH="$1"; EXTERNAL_MAP_RAW="${2:-}"; ENV_SLUG="$3"; ACCOUNT_ID="$4"; CF_EMAIL="$5"; CF_KEY="$6"; ZONE_ID="$7"
EXTERNAL_MAP=$(normalize_external_map "$EXTERNAL_MAP_RAW")

# Ensure jq & node are available
command -v jq >/dev/null || { echo "jq not found on runner"; exit 1; }
command -v node >/dev/null || { echo "node not found on runner"; exit 1; }

# Take first 3 apps
APP_NAMES=$(echo "$EXTERNAL_MAP" | jq -r 'to_entries | .[:3] | map(.value | split(":")[0]) | .[]')

WORKER_TEMPLATE="$ROOT/maintenance-worker.js"
[ -f "$WORKER_TEMPLATE" ] || { echo "Template not found: $WORKER_TEMPLATE"; exit 1; }
[ -f "$HTML_PATH" ] || { echo "Maintenance HTML not found: $HTML_PATH"; exit 1; }

# Build a module worker by replacing a sentinel token __HTML__ with JSON-encoded HTML content
build_worker_js() {
  local tpl="$1" html="$2" out="$3"
  node -e '
    const fs = require("fs");
    const tplPath = process.argv[1];
    const htmlPath = process.argv[2];
    const outPath = process.argv[3];
    const tpl = fs.readFileSync(tplPath, "utf8");
    const html = fs.readFileSync(htmlPath, "utf8");
    const htmlJson = JSON.stringify(html);
    const rendered = tpl.replace(/__HTML__/g, htmlJson);
    fs.writeFileSync(outPath, rendered);
  ' "$tpl" "$html" "$out"
}

for APP in $APP_NAMES; do
  WORKER_NAME="maintenance-page-${ENV_SLUG}-${APP}"
  PATTERN="dj-panel-${ENV_SLUG}-${APP}.djbeatblaster.com/*"

  TMP_JS="$(mktemp /tmp/worker-script.XXXXXX.js)"
  build_worker_js "$WORKER_TEMPLATE" "$HTML_PATH" "$TMP_JS"

  # Upload as a module worker and check response
  upload_resp=$(curl -sS -f -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
    -H "X-Auth-Email: ${CF_EMAIL}" \
    -H "X-Auth-Key: ${CF_KEY}" \
    -H "Content-Type: application/javascript+module" \
    --data-binary @"$TMP_JS" ) || {
      echo "❌ Failed to upload worker ${WORKER_NAME}"
      echo "Response (if any): $upload_resp"
      exit 1
    }

  if [ "$(echo "$upload_resp" | jq -r '.success')" != "true" ]; then
    echo "❌ Cloudflare API reported failure uploading ${WORKER_NAME}"
    echo "$upload_resp" | jq -C .
    exit 1
  fi

  # Upsert the route
  routes_resp=$(curl -sS -f \
    "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" \
    -H "X-Auth-Email: ${CF_EMAIL}" \
    -H "X-Auth-Key: ${CF_KEY}")

  rid=$(echo "$routes_resp" | jq -r --arg p "$PATTERN" '.result[]? | select(.pattern == $p)? | .id // empty')

  body=$(jq -n --arg pattern "$PATTERN" --arg script "$WORKER_NAME" '{pattern:$pattern,script:$script}')

  if [ -n "$rid" ]; then
    route_resp=$(curl -sS -f -X PUT \
      "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes/${rid}" \
      -H "X-Auth-Email: ${CF_EMAIL}" \
      -H "X-Auth-Key: ${CF_KEY}" \
      -H "Content-Type: application/json" \
      --data "$body")
  else
    route_resp=$(curl -sS -f -X POST \
      "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes" \
      -H "X-Auth-Email: ${CF_EMAIL}" \
      -H "X-Auth-Key: ${CF_KEY}" \
      -H "Content-Type: application/json" \
      --data "$body")
  fi

  if [ "$(echo "$route_resp" | jq -r '.success')" != "true" ]; then
    echo "❌ Cloudflare API reported failure configuring route for ${PATTERN}"
    echo "$route_resp" | jq -C .
    exit 1
  fi

  echo "✅ Enabled maintenance for $PATTERN (worker: ${WORKER_NAME})"
done
