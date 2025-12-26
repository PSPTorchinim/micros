#!/bin/bash
# Script to restore data volumes on TrueNAS from backup archives
# This extracts compressed archives back to their original locations
# Usage: ./restore-data-volumes.sh "environment" "env_slug" "base_dir" "backup_timestamp"

set -euo pipefail

# ======================== Logging ==========================
readonly RED='\033[0;31m'; readonly GREEN='\033[0;32m'; readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'; readonly NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO] $1${NC}" >&2; }
log_warn() { echo -e "${YELLOW}[WARN] $1${NC}" >&2; }
log_error() { echo -e "${RED}[ERROR] $1${NC}" >&2; }

# ======================== Input Validation ==========================
if [ $# -ne 4 ]; then
  echo "Usage: $0 \"environment\" \"env_slug\" \"base_dir\" \"backup_timestamp\""
  exit 1
fi

ENVIRONMENT="$1"
ENV_SLUG="$2"
BASE_DIR="$3"
BACKUP_TIMESTAMP="$4"

DATA_DIR="${BASE_DIR}/data"
BACKUP_DIR="${BASE_DIR}/Images/backups/data"

log_info "=========================================="
log_info "Data Restore Script"
log_info "=========================================="
log_info "Environment: ${ENVIRONMENT}"
log_info "Environment Slug: ${ENV_SLUG}"
log_info "Base Directory: ${BASE_DIR}"
log_info "Data Directory: ${DATA_DIR}"
log_info "Backup Directory: ${BACKUP_DIR}"
log_info "Backup Timestamp: ${BACKUP_TIMESTAMP}"

# ======================== Validate Backup Directory ==========================
if [ ! -d "${BACKUP_DIR}" ]; then
  log_error "Backup directory does not exist: ${BACKUP_DIR}"
  exit 1
fi

# ======================== Define Critical Volumes ==========================
# These should match the volumes backed up in backup-data-volumes.sh
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

# ======================== Restore Function ==========================
restore_volume() {
  local volume_path="$1"
  local volume_name=$(echo "$volume_path" | tr '/' '_')
  local full_path="${DATA_DIR}/${volume_path}"
  local backup_file="${BACKUP_DIR}/${ENV_SLUG}-${volume_name}-${BACKUP_TIMESTAMP}.tar.gz"
  
  # Check if backup file exists
  if [ ! -f "$backup_file" ]; then
    log_warn "Backup file does not exist, skipping: ${backup_file}"
    return 0
  fi
  
  log_info "Restoring: ${volume_path} from ${backup_file}"
  
  # Create parent directory if it doesn't exist
  local parent_dir=$(dirname "$full_path")
  mkdir -p "$parent_dir"
  
  # Remove existing data (if any) to ensure clean restore
  if [ -d "$full_path" ]; then
    log_info "Removing existing data: ${full_path}"
    rm -rf "$full_path"
  fi
  
  # Extract archive
  # Using tar to extract, preserving permissions and timestamps
  if tar_error=$(tar -xzf "$backup_file" -C "$parent_dir" 2>&1); then
    # Verify that the restore target exists and contains files
    if [ -d "$full_path" ] && find "$full_path" -mindepth 1 -print -quit 2>/dev/null | grep -q .; then
      local size
      size=$(du -sh "$full_path" 2>/dev/null | cut -f1)
      log_info "✅ Restored: ${full_path} (${size})"
      echo "RESTORED_VOLUME=$volume_path"
    else
      log_error "❌ Restore completed but no files were found in: ${full_path}"
      return 1
    fi
  else
    log_error "❌ Failed to restore: ${volume_path}"
    log_error "tar error output: ${tar_error}"
    return 1
  fi
  
  # Set proper permissions (universal access for Docker containers)
  chmod -R 777 "$full_path" 2>/dev/null || log_warn "Could not set permissions on ${full_path}"
}

# ======================== Main Restore Loop ==========================
log_info ""
log_info "Starting restore of critical volumes..."
log_info ""

restore_count=0
failed_count=0
skipped_count=0

for volume in "${CRITICAL_VOLUMES[@]}"; do
  volume_name=$(echo "$volume" | tr '/' '_')
  backup_file="${BACKUP_DIR}/${ENV_SLUG}-${volume_name}-${BACKUP_TIMESTAMP}.tar.gz"
  
  if [ ! -f "$backup_file" ]; then
    log_warn "No backup found for ${volume}, skipping"
    ((skipped_count++))
    continue
  fi
  
  if restore_volume "$volume"; then
    ((restore_count++))
  else
    ((failed_count++))
  fi
done

# ======================== Summary ==========================
log_info ""
log_info "=========================================="
log_info "Restore Summary"
log_info "=========================================="
log_info "Successful restores: ${restore_count}"
log_info "Failed restores: ${failed_count}"
log_info "Skipped (no backup): ${skipped_count}"
log_info "Backup timestamp: ${BACKUP_TIMESTAMP}"
log_info "=========================================="

# Output for GitHub Actions
echo "RESTORE_COUNT=${restore_count}"
echo "FAILED_COUNT=${failed_count}"
echo "SKIPPED_COUNT=${skipped_count}"

# Exit with error if any restores failed
if [ "$failed_count" -gt 0 ]; then
  log_error "Some restores failed!"
  exit 1
fi

log_info "✅ All restores completed successfully!"
exit 0
