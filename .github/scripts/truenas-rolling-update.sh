#!/usr/bin/env bash
set -euo pipefail

truenas_rolling_update() {
  local ENV="$1" SLUG="$2" NEW="$3"
  local base="/mnt/Files/Apps/DJPanel/${ENV}/Images"
  local agg="${base}/dj-panel-${SLUG}.yml"
  local app="dj-panel-${SLUG}"

  [ -f "$NEW" ] || { echo "ERROR: compose not found: $NEW"; return 1; }
  mkdir -p "$base"
  printf 'include:\n  - %s\n' "$NEW" > "$agg"
  ls -1 "${base}/dj-panel-${SLUG}-"*.yml 2>/dev/null | sort -r | awk 'NR>3' | xargs -r rm -f || true

  get_state() {
    j="$(midclt call app.query '[["name","=","'"$app"'"]]' 2>/dev/null || echo '[]')"
    if command -v jq >/dev/null; then echo "$j" | jq -r '.[0] | (.state // .status // empty)' | head -n1; else echo "$j" | tr -d '\n' | awk '{s=$0;if (match(s, /"state" *: *"[^"]*"/)){m=substr(s,RSTART,RLENGTH);gsub(/.*"state" *: *"/,"",m);gsub(/".*$/, "", m);print m}}' | head -n1; fi
  }

  current_state="$(get_state || echo NOT_FOUND)"; echo "Current: $current_state"
  if [ "$current_state" = NOT_FOUND ] || [ "$current_state" = STOPPED ]; then
    midclt call app.start "$app" 2>/dev/null || midclt call chart.release.scale "$app" '{"replica_count":1}' 2>/dev/null || { echo "ERROR: start failed"; return 1; }
  else
    midclt call app.restart "$app" 2>/dev/null || {
      midclt call app.stop "$app" 2>/dev/null || true
      for i in $(seq 1 90); do st="$(get_state || echo UNKNOWN)"; echo "stop check $i: $st"; [ "$st" = STOPPED ] || [ "$st" = NOT_FOUND ] && break; sleep 2; done
      midclt call app.start "$app" 2>/dev/null || { echo "ERROR: could not restart"; return 1; }
    }
  fi

  is_good() { case "$1" in RUNNING|ACTIVE|DEPLOYED|STARTED|HEALTHY) return 0;; *) return 1;; esac }
  for i in $(seq 1 120); do st="$(get_state || echo UNKNOWN)"; echo "health $i: $st"; is_good "$st" && { echo "APP_STATE=$st"; return 0; }; sleep 5; done
  echo "APP_STATE=$st"; return 1
}
