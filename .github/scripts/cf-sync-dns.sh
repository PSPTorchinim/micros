#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")" && pwd)
. "$ROOT/cf-common.sh"

ENV_SLUG="$1"; EXTERNAL_MAP_RAW="$2"; ACCOUNT_ID="$3"; CF_EMAIL="$4"; CF_KEY="$5"; TUNNEL_UUID="$6"; BASE_DOMAIN_IN="${7:-}"
EXTERNAL_MAP=$(normalize_external_map "$EXTERNAL_MAP_RAW")
BASE_DOMAIN=$(derive_base_domain "$ACCOUNT_ID" "$CF_EMAIL" "$CF_KEY" "$TUNNEL_UUID" "$BASE_DOMAIN_IN")
TARGET="${TUNNEL_UUID}.cfargotunnel.com"

ZONE_ID=$(curl -sS -G "https://api.cloudflare.com/client/v4/zones" --data-urlencode "name=${BASE_DOMAIN}" --data-urlencode "status=active" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" | jq -r '.result[0].id')
[ -n "$ZONE_ID" ] && [ "$ZONE_ID" != null ] || { echo "Zone not found: $BASE_DOMAIN"; exit 1; }

LABELS=$(build_service_fqdns "$ENV_SLUG" "$BASE_DOMAIN" "$EXTERNAL_MAP" | jq -c --arg base "$BASE_DOMAIN" 'map( sub("\\."+($base|gsub("\\."; "\\."))+"$"; "") )')
for label in $(echo "$LABELS" | jq -r '.[]'); do
  rec=$(curl -sS -G "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" --data-urlencode "type=CNAME" --data-urlencode "name=${label}.${BASE_DOMAIN}" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}")
  rid=$(echo "$rec" | jq -r '.result[0].id // empty')
  body=$(jq -c --arg name "$label" --arg content "$TARGET" -n '{type:"CNAME", name:$name, content:$content, ttl:1, proxied:true}')
  if [ -n "$rid" ]; then
    cur=$(echo "$rec" | jq -r '.result[0].content'), prox=$(echo "$rec" | jq -r '.result[0].proxied')
    curl -sS -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${rid}" -H "Content-Type: application/json" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" --data-binary "$body" >/dev/null
  else
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" -H "Content-Type: application/json" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" --data-binary "$body" >/dev/null
  fi
  echo "CNAME ensured: ${label}.${BASE_DOMAIN} -> ${TARGET}"
done
