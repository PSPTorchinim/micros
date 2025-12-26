#!/bin/bash
# Script to backup data volumes from TrueNAS
# This creates compressed archives of all critical data volumes for rollback purposes
# Usage: ./backup-data-volumes.sh "environment" "env_slug" "base_dir" ["timestamp"]

set -euo pipefail

# ======================== Logging ==========================
readonly RED='\033[0;31m'; readonly GREEN='\033[0;32m'; readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'; readonly NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO] $1${NC}" >&2; }
log_warn() { echo -e "${YELLOW}[WARN] $1${NC}" >&2; }
log_error() { echo -e "${RED}[ERROR] $1${NC}" >&2; }

# ======================== Input Validation ==========================
if [ $# -lt 3 ] || [ $# -gt 4 ]; then
  echo "Usage: $0 \"environment\" \"env_slug\" \"base_dir\" [\"timestamp\"]"
  exit 1
fi

ENVIRONMENT="$1"
ENV_SLUG="$2"
BASE_DIR="$3"
TIMESTAMP="${4:-$(date +%Y%m%d_%H%M%S)}"

DATA_DIR="${BASE_DIR}/data"
BACKUP_DIR="${BASE_DIR}/Images/backups/data"

log_info "=========================================="
log_info "Data Backup Script"
log_info "=========================================="
log_info "Environment: ${ENVIRONMENT}"
log_info "Environment Slug: ${ENV_SLUG}"
log_info "Base Directory: ${BASE_DIR}"
log_info "Data Directory: ${DATA_DIR}"
log_info "Backup Directory: ${BACKUP_DIR}"
log_info "Timestamp: ${TIMESTAMP}"

# ======================== Create Backup Directory ==========================
mkdir -p "${BACKUP_DIR}"
log_info "✅ Backup directory ensured: ${BACKUP_DIR}"

# ======================== Define Critical Volumes ==========================
# These are the volumes that contain persistent data that needs backup
declare -a CRITICAL_VOLUMES=(
  "mongodb_container/mongo_data"
  "mongodb_container/mongo_config"
  "sqlserver/mssql_data"
  "strapi_db/pg_data"
  "rabbitmq/rabbitmq_data"
  "redis/redis_data"
  "strapi/strapi_app"
  "loki/loki_data"
  "prometheus/prometheus_data"
  "grafana/grafana_data"
)

# ======================== Backup Function ==========================
backup_volume() {
  local volume_path="$1"
  local volume_name=$(echo "$volume_path" | tr '/' '_')
  local full_path="${DATA_DIR}/${volume_path}"
  local backup_file="${BACKUP_DIR}/${ENV_SLUG}-${volume_name}-${TIMESTAMP}.tar.gz"
  
  # Check if volume exists
  if [ ! -d "$full_path" ]; then
    log_warn "Volume does not exist, skipping: ${full_path}"
    return 2
  fi
  
  # Check if volume is empty
  if [ -z "$(ls -A "$full_path" 2>/dev/null)" ]; then
    log_warn "Volume is empty, skipping: ${full_path}"
    return 3
  fi
  
  log_info "Backing up: ${volume_path}"
  
  # Create compressed archive of the volume
  # Using tar with gzip compression, preserving permissions and timestamps
  if tar_output=$(tar -czf "$backup_file" -C "$(dirname "$full_path")" "$(basename "$full_path")" 2>&1); then
    local size=$(du -h "$backup_file" | cut -f1)
    log_info "✅ Backup created: ${backup_file} (${size})"
    echo "BACKUP_FILE=$backup_file"
  else
    log_error "❌ Failed to backup: ${volume_path}"
    log_error "tar output: ${tar_output}"
    return 1
  fi
}

# ======================== Main Backup Loop ==========================
log_info ""
log_info "Starting backup of critical volumes..."
log_info ""

backup_count=0
failed_count=0
skipped_count=0

for volume in "${CRITICAL_VOLUMES[@]}"; do
  backup_volume "$volume"
  result=$?
  if [ $result -eq 0 ]; then
    ((backup_count++))
  elif [ $result -eq 2 ] || [ $result -eq 3 ]; then
    ((skipped_count++))
  else
    ((failed_count++))
  fi
done

# ======================== Cleanup Old Backups ==========================
log_info ""
log_info "Cleaning up old backups (keeping last 5)..."

# For each volume type, keep only the 5 most recent backups
for volume in "${CRITICAL_VOLUMES[@]}"; do
  volume_name=$(echo "$volume" | tr '/' '_')
  pattern="${BACKUP_DIR}/${ENV_SLUG}-${volume_name}-*.tar.gz"
  
  # Count backups for this volume
  backup_files=$(ls -1t $pattern 2>/dev/null || true)
  if [ -z "$backup_files" ]; then
    continue
  fi
  
  count=$(echo "$backup_files" | wc -l)
  if [ "$count" -gt 5 ]; then
    # Remove old backups (keep newest 5)
    echo "$backup_files" | tail -n +6 | xargs -r rm -f
    removed=$((count - 5))
    log_info "Cleaned up ${removed} old backup(s) for ${volume_name}"
  fi
done

# ======================== Summary ==========================
log_info ""
log_info "=========================================="
log_info "Backup Summary"
log_info "=========================================="
log_info "Successful backups: ${backup_count}"
log_info "Skipped volumes: ${skipped_count}"
log_info "Failed backups: ${failed_count}"
log_info "Backup timestamp: ${TIMESTAMP}"
log_info "=========================================="

# Output for GitHub Actions
echo "BACKUP_TIMESTAMP=${TIMESTAMP}"
echo "BACKUP_COUNT=${backup_count}"
echo "SKIPPED_COUNT=${skipped_count}"
echo "FAILED_COUNT=${failed_count}"

# Exit with error if any backups failed
if [ "$failed_count" -gt 0 ]; then
  log_error "Some backups failed!"
  exit 1
fi

log_info "✅ All backups completed successfully!"
exit 0
