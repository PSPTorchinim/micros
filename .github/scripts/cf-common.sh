#!/usr/bin/env bash
set -euo pipefail

json_get() { jq -r "$1" 2>/dev/null; }

derive_base_domain() {
  local account_id="$1" email="$2" key="$3" tunnel_uuid="$4" base="$5"
  if [ -n "$base" ]; then echo "$base"; return; fi
  curl -sS -X GET "https://api.cloudflare.com/client/v4/accounts/${account_id}/cfd_tunnel/${tunnel_uuid}/configurations" \
    -H "X-Auth-Email: ${email}" -H "X-Auth-Key: ${key}" \
  | jq -r '.result.config.ingress[]?.hostname // empty' \
  | awk -F. 'NF>=2 {print $(NF-1)"."$NF}' \
  | sort | uniq -c | sort -nr | awk 'NR==1{print $2}'
}

normalize_external_map() {
  local map_json="$1"
  if echo "$map_json" | jq -e . >/dev/null 2>&1; then
    echo "$map_json"
  else
    echo '{}' # fallback
  fi
}

build_service_fqdns() {
  local env_slug="$1" base_domain="$2" external_map="$3"
  echo "$external_map" | jq -c --arg env "$env_slug" --arg base "$base_domain" '
    to_entries | map("dj-panel-" + $env + "-" + (.value | split(":")[0]) + "." + $base)
  '
}
