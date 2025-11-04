#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")" && pwd)
. "$ROOT/cf-common.sh"

ENV_SLUG="$1"; EXTERNAL_MAP_RAW="$2"; ACCOUNT_ID="$3"; CF_EMAIL="$4"; CF_KEY="$5"; TUNNEL_UUID="$6"; BASE_DOMAIN_IN="${7:-}"; HOST_IP="${8:-192.168.1.17}"
EXTERNAL_MAP=$(normalize_external_map "$EXTERNAL_MAP_RAW")
BASE_DOMAIN=$(derive_base_domain "$ACCOUNT_ID" "$CF_EMAIL" "$CF_KEY" "$TUNNEL_UUID" "$BASE_DOMAIN_IN")

CURRENT=$(curl -sS -X GET "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_UUID}/configurations" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}")
KEEP=$(echo "$CURRENT" | jq -c --arg env "$ENV_SLUG" '.result.config.ingress | map(select(.hostname? != null)) | map(select(.hostname | test("^dj-panel-" + $env + "-"; "i") | not))')
DYN=$(echo "$EXTERNAL_MAP" | jq -c --arg env "$ENV_SLUG" --arg base "$BASE_DOMAIN" --arg ip "$HOST_IP" '
  to_entries | map({hostname:("dj-panel-"+$env+"-"+(.value|split(":")[0])+"."+$base), service:("http://"+$ip+":"+.key)})
')
INGRESS=$(jq -c --argjson keep "$KEEP" --argjson dyn "$DYN" -n '$keep + $dyn + [{"service":"http_status:404"}]')
BODY=$(jq -c --argjson ing "$INGRESS" -n '{config:{ingress:$ing, "warp-routing":{"enabled":true}}}')
resp=$(curl -sS -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_UUID}/configurations" -H "Content-Type: application/json" -H "X-Auth-Email: ${CF_EMAIL}" -H "X-Auth-Key: ${CF_KEY}" --data-binary "$BODY")
[ "$(echo "$resp" | jq -r .success)" = true ] || { echo "$resp" | jq .; exit 1; }
