#!/bin/bash
# Script to stop application services while keeping databases and infrastructure running
# This allows for data backup before deployment and maintains database availability
# Usage: ./stop-app-services.sh "app_name"

set -euo pipefail

# ======================== Logging ==========================
readonly RED='\033[0;31m'; readonly GREEN='\033[0;32m'; readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'; readonly NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO] $1${NC}" >&2; }
log_warn() { echo -e "${YELLOW}[WARN] $1${NC}" >&2; }
log_error() { echo -e "${RED}[ERROR] $1${NC}" >&2; }

# ======================== Input Validation ==========================
if [ $# -ne 1 ]; then
  echo "Usage: $0 \"app_name\""
  exit 1
fi

APP_NAME="$1"

log_info "=========================================="
log_info "Stop Application Services Script"
log_info "=========================================="
log_info "App Name: ${APP_NAME}"

# ======================== Helper Functions ==========================
has_jq() { command -v jq >/dev/null 2>&1; }

get_state() {
  j="$(midclt call app.query '[["name","=","'"$APP_NAME"'"]]' 2>/dev/null || echo '[]')"
  if has_jq; then
    echo "$j" | jq -r '.[0] | (.state // .status // empty)' 2>/dev/null | head -n1
  else
    echo "$j" | tr -d '\n' | awk '{
      s=$0
      if (match(s, /"state"[[:space:]]*:[[:space:]]*"[^"]*"/)) {
        m=substr(s, RSTART, RLENGTH)
        gsub(/.*"state"[[:space:]]*:[[:space:]]*"/, "", m)
        gsub(/".*$/, "", m)
        print m
      }
    }' | head -n1
  fi
}

# ======================== Check App Exists ==========================
current_state="$(get_state || echo 'NOT_FOUND')"
log_info "Current app state: $current_state"

if [ "$current_state" = "NOT_FOUND" ]; then
  log_warn "App not found: ${APP_NAME}"
  log_info "Nothing to stop"
  echo "APP_STATE=NOT_FOUND"
  exit 0
fi

if [ "$current_state" = "STOPPED" ]; then
  log_info "App is already stopped: ${APP_NAME}"
  echo "APP_STATE=STOPPED"
  exit 0
fi

# ======================== Stop Application Services ==========================
log_info "Stopping application services (databases will remain running)..."

# Use TrueNAS midclt to stop the app
if midclt call app.stop "$APP_NAME" 2>/dev/null; then
  log_info "✅ Stop command issued successfully"
else
  log_error "❌ Failed to issue stop command"
  exit 1
fi

# ======================== Wait for Stop ==========================
log_info "⏳ Waiting for app to stop..."
stop_wait=0
max_stop_iterations=90  # 3 minutes timeout (90 * 2 seconds)
stop_state="UNKNOWN"

while [ $stop_wait -lt $max_stop_iterations ]; do
  stop_state="$(get_state || echo 'UNKNOWN')"
  [ -z "$stop_state" ] && stop_state="UNKNOWN"
  
  log_info "  Stop check $((stop_wait+1))/$max_stop_iterations: state=$stop_state"
  
  if [ "$stop_state" = "STOPPED" ] || [ "$stop_state" = "NOT_FOUND" ]; then
    log_info "✅ App stopped successfully"
    break
  fi
  
  sleep 2
  stop_wait=$((stop_wait+1))
done

if [ "$stop_state" != "STOPPED" ] && [ "$stop_state" != "NOT_FOUND" ]; then
  log_error "❌ ERROR: App failed to stop after 3 minutes (state=$stop_state)"
  log_error "Cannot proceed with deployment - manual intervention required"
  exit 1
fi

# ======================== Summary ==========================
log_info ""
log_info "=========================================="
log_info "✅ Application services stopped successfully"
log_info "=========================================="

# Output for GitHub Actions
echo "APP_STATE=${stop_state}"
exit 0
