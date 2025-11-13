#!/bin/bash
# Script to generate Docker Compose file with GHCR images based on existing compose file
# Usage: ./generate-compose-file.sh "internal_ports" "external_ports" "docker_tag" "repo_owner" "repo_name" "data_base_dir" "output_file"

set -Eeuo pipefail   # -E makes the ERR trap work inside functions

# ======================== Advanced Logging Config ==========================
LOG_LEVEL="${LOG_LEVEL:-INFO}"   # DEBUG|INFO|WARN|ERROR
LOG_FILE="${LOG_FILE:-generate-compose-$(date +%Y%m%d_%H%M%S).log}"
ENABLE_FILE_LOGGING="${ENABLE_FILE_LOGGING:-true}"
ENABLE_SHELL_XTRACE="${ENABLE_SHELL_XTRACE:-false}"

readonly RED='\033[0;31m'; readonly GREEN='\033[0;32m'; readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'; readonly NC='\033[0m'

_log_location() {
  local depth="${1:-1}"
  local info
  info=$(caller "$depth" 2>/dev/null || true)
  if [[ -n "$info" ]]; then
    local parts=($info); local line="${parts[0]}"; local func="${parts[1]:-main}"; local file="${parts[2]:-$(basename "$0")}"
    echo "$file:$func:$line"
  else
    echo "$(basename "$0"):main:?"
  fi
}

log_message() {
  local level="$1"; local message="$2"; local color="${3:-$NC}"
  local ts; ts=$(date '+%Y-%m-%d %H:%M:%S')
  local loc; loc="$(_log_location 2)"
  echo -e "${color}[${ts}] [${level}] [$loc] ${message}${NC}" 1>&2
  if [[ "$ENABLE_FILE_LOGGING" == "true" ]]; then
    echo "[${ts}] [${level}] [$loc] ${message}" >> "$LOG_FILE"
  fi
}
log_debug(){ [[ "$LOG_LEVEL" == "DEBUG" ]] && log_message "DEBUG" "$1" "$CYAN"; }
log_info(){  [[ "$LOG_LEVEL" =~ ^(DEBUG|INFO)$ ]] && log_message "INFO" "$1" "$GREEN"; }
log_warn(){  [[ "$LOG_LEVEL" =~ ^(DEBUG|INFO|WARN)$ ]] && log_message "WARN" "$1" "$YELLOW"; }
log_error(){ log_message "ERROR" "$1" "$RED"; }
log_section(){ log_info "==================== $1 ===================="; }
log_subsection(){ log_info "---------- $1 ----------"; }

_enable_shell_xtrace() {
  if [[ "$LOG_LEVEL" == "DEBUG" && "$ENABLE_SHELL_XTRACE" == "true" ]]; then
    export PS4='+ $(date "+%Y-%m-%d %H:%M:%S") [$(_log_location 1)] >> '
    set -x
  fi
}

start_time=$(date +%s)
log_timer(){ local now=$(date +%s); local s=$((now - start_time)); log_info "Total execution time: ${s}s"; }

handle_error() {
  local line="$1"; local cmd="$2"; local status="$3"
  log_error "Script failed at line ${line}"
  log_error "Failing command: ${cmd}"
  log_error "Exit code: ${status}"
  log_debug "Current counters at failure: internal=${internal_counter:-unset}/${internal_count:-unset}, external=${external_counter:-unset}/${external_count:-unset}"
  log_timer
  exit 1
}
trap 'handle_error "${BASH_LINENO[0]}" "${BASH_COMMAND}" "$?"' ERR

# ======================== Input Handling ==========================
normalize_base_dir() {
  local p="$1"
  if [[ "$p" == /* ]]; then echo "$p"; return; fi
  echo "/mnt/${p}"
}

validate_inputs() {
  log_section "Input Validation"
  [[ -z "${INTERNAL_PORTS}" ]] && { log_error "Internal ports parameter is empty"; exit 1; }
  [[ -z "${EXTERNAL_PORTS}" ]] && { log_error "External ports parameter is empty"; exit 1; }
  [[ -z "${DOCKER_TAG}"     ]] && { log_error "Docker tag parameter is empty"; exit 1; }
  [[ -z "${REPO_OWNER}"     ]] && { log_error "Repository owner parameter is empty"; exit 1; }
  [[ -z "${REPO_NAME}"      ]] && { log_error "Repository name parameter is empty"; exit 1; }
  [[ -z "${DATA_BASE_DIR}"  ]] && { log_error "Data base directory parameter is empty"; exit 1; }
  log_info "Input validation passed"
}

if [ $# -ne 7 ]; then
  echo "Usage: $0 \"internal_ports\" \"external_ports\" \"docker_tag\" \"repo_owner\" \"repo_name\" \"data_base_dir\" \"output_file\""
  exit 1
fi
INTERNAL_PORTS="$1"
EXTERNAL_PORTS="$2"
DOCKER_TAG="$3"
REPO_OWNER="$4"
REPO_NAME="$5"
DATA_BASE_DIR="$6"
OUTPUT_FILE="$7"

BASE_DATA_DIR="$(normalize_base_dir "$DATA_BASE_DIR")"
log_section "Script Initialization"
log_info "Starting Docker Compose file generation"
log_info "Log level: $LOG_LEVEL"
log_info "Log file: $LOG_FILE"
log_info "File logging: $ENABLE_FILE_LOGGING"
log_info "Base data directory (normalized): $BASE_DATA_DIR"

validate_inputs
_enable_shell_xtrace

# ======================== Globals & Helpers ==========================
SOURCE_COMPOSE="Docker/dj-panel-composer.yml"

# Infrastructure services that need external access (exposed via Cloudflare tunnel)
# - Services in Docker/infra/* are normally assigned internal ports (40000-49999)
# - Services in Docker/services/* and Docker/frontends/* get external ports (50000-59999)
# - List infra services here that need external access exceptions
# - Format: space-separated list of service names
# - Example: To expose a new infra service "prometheus", add it to this list:
#   EXTERNAL_ACCESS_INFRA_SERVICES="strapi grafana prometheus"
EXTERNAL_ACCESS_INFRA_SERVICES="strapi grafana"

log_subsection "Source File Validation"
if [ ! -f "$SOURCE_COMPOSE" ]; then
  log_error "Source compose file $SOURCE_COMPOSE not found"
  log_error "Current dir: $(pwd)"
  exit 1
fi
log_info "Source compose file found: $SOURCE_COMPOSE"

log_subsection "Port Configuration"
read -ra INTERNAL_PORT_ARRAY <<< "$INTERNAL_PORTS"
read -ra EXTERNAL_PORT_ARRAY <<< "$EXTERNAL_PORTS"
internal_count=${#INTERNAL_PORT_ARRAY[@]}
external_count=${#EXTERNAL_PORT_ARRAY[@]}
log_info "Internal ports available: $internal_count"
log_info "External ports available: $external_count"
: $((internal_counter=0))
: $((external_counter=0))
NEXT_PORT=""; CONVERTED_PORTS=""
declare -A USED_HOST_PORTS
declare -A USED_EXTERNAL_PORTS

track_port_use() {
  local host service cport is_external
  host="$1"
  service="$2"
  cport="$3"
  is_external="${4:-false}"
  if [[ -n "${USED_HOST_PORTS[$host]:-}" ]]; then
    log_warn "Duplicate host port: $host (had ${USED_HOST_PORTS[$host]}, now ${service}:${cport})"
    USED_HOST_PORTS["$host"]+=",${service}:${cport}"
  else
    USED_HOST_PORTS["$host"]="${service}:${cport}"
  fi
  if [[ "${is_external:-false}" == "true" ]]; then
    if [[ -n "${USED_EXTERNAL_PORTS[$host]:-}" ]]; then
      USED_EXTERNAL_PORTS["$host"]+=",${service}:${cport}"
    else
      USED_EXTERNAL_PORTS["$host"]="${service}:${cport}"
    fi
  fi
}

get_next_internal_port() {
  if (( internal_counter < internal_count )); then
    NEXT_PORT="${INTERNAL_PORT_ARRAY[$internal_counter]}"; ((++internal_counter))
  else
    log_warn "INT ports exhausted; fallback 40000"; NEXT_PORT="40000"
  fi
}
get_next_external_port() {
  if (( external_counter < external_count )); then
    NEXT_PORT="${EXTERNAL_PORT_ARRAY[$external_counter]}"; ((++external_counter))
  else
    log_warn "EXT ports exhausted; fallback 50000"; NEXT_PORT="50000"
  fi
}

get_port_function_for_service() {
  local service_name="$1" dockerfile="$2"
  # Normalize the dockerfile path for consistent matching
  local normalized_dockerfile
  normalized_dockerfile=$(normalize_dockerfile_path "$dockerfile")
  if [[ "$normalized_dockerfile" == Docker/infra/* ]]; then
    # Check if this infra service needs external access
    for external_svc in $EXTERNAL_ACCESS_INFRA_SERVICES; do
      [[ "$service_name" == "$external_svc" ]] && { echo "get_next_external_port"; return; }
    done
    echo "get_next_internal_port"
  else
    echo "get_next_external_port"
  fi
}

to_lc() { tr '[:upper:]' '[:lower:]' <<<"$1"; }

normalize_dockerfile_path() {
  local path="$1"
  # Normalize path by resolving .. and . components
  # This handles multiple levels of .. properly
  local result=""
  local IFS='/'
  local -a parts
  read -ra parts <<< "$path"
  local -a stack=()
  
  for part in "${parts[@]}"; do
    if [[ "$part" == ".." ]]; then
      # Pop from stack if not empty
      [[ ${#stack[@]} -gt 0 ]] && unset 'stack[-1]'
    elif [[ "$part" != "." && -n "$part" ]]; then
      # Push non-empty, non-current-dir parts
      stack+=("$part")
    fi
  done
  
  # Join the stack back into a path
  result=$(IFS='/'; printf '%s' "${stack[*]}")
  echo "$result"
}

dockerfile_to_image() {
  local dockerfile="$1" service_name="$2" microservice_name="$3"
  # Normalize the dockerfile path to remove .. and .
  local normalized_dockerfile
  normalized_dockerfile=$(normalize_dockerfile_path "$dockerfile")
  local dockerfile_dir; dockerfile_dir=$(dirname "$normalized_dockerfile" | sed 's|Docker/||')
  local dockerfile_base; dockerfile_base=$(basename "$normalized_dockerfile" .Dockerfile)

  local owner_lc repo_lc base_lc msvc_lc mfe_lc service_lc dir_lc
  owner_lc="$(to_lc "${REPO_OWNER}")"
  repo_lc="$(to_lc "${REPO_NAME}")"
  base_lc="$(to_lc "${dockerfile_base}")"
  dir_lc="$(to_lc "${dockerfile_dir}")"
  service_lc="$(to_lc "${service_name}")"
  msvc_lc="$(to_lc "${microservice_name}")"

  if [[ "$normalized_dockerfile" == Docker/infra/* ]]; then
    echo "ghcr.io/${owner_lc}/${repo_lc}/infra/${base_lc}:${DOCKER_TAG}"
  elif [[ "$normalized_dockerfile" == Docker/services/* ]]; then
    if [[ -n "$microservice_name" && "$microservice_name" != "null" ]]; then
      echo "ghcr.io/${owner_lc}/${repo_lc}/services/${msvc_lc}:${DOCKER_TAG}"
    else
      echo "ghcr.io/${owner_lc}/${repo_lc}/services/${base_lc}:${DOCKER_TAG}"
    fi
  elif [[ "$normalized_dockerfile" == Docker/frontends/* || "$normalized_dockerfile" == *react.Dockerfile ]]; then
    local microfrontend_name
    microfrontend_name=$(yq eval ".services.${service_name}.build.args.MICROFRONTEND_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [[ -n "$microfrontend_name" && "$microfrontend_name" != "null" ]]; then
      mfe_lc="$(to_lc "${microfrontend_name}")"
      echo "ghcr.io/${owner_lc}/${repo_lc}/frontends/${mfe_lc}:${DOCKER_TAG}"
    else
      echo "ghcr.io/${owner_lc}/${repo_lc}/frontends/${service_lc}:${DOCKER_TAG}"
    fi
  else
    log_warn "Unknown dockerfile pattern for $service_name; generic path"
    echo "ghcr.io/${owner_lc}/${repo_lc}/${dir_lc}/${base_lc}:${DOCKER_TAG}"
  fi
}

convert_ports() {
  local service_name="$1" get_port_function="$2"
  CONVERTED_PORTS=""
  local is_external="false"; [[ "$get_port_function" == "get_next_external_port" ]] && is_external="true"

  local has_ports; has_ports=$(yq eval ".services.${service_name} | has(\"ports\")" "$SOURCE_COMPOSE" 2>/dev/null)
  [[ "$has_ports" != "true" ]] && { return 0; }

  local port_output="    ports:"; local port_count=0
  local port_mappings; port_mappings=$(yq eval ".services.${service_name}.ports[]" "$SOURCE_COMPOSE" 2>/dev/null)

  while IFS= read -r port_mapping; do
    [[ -z "$port_mapping" || "$port_mapping" == "null" ]] && continue
    local container_port
    container_port="$(sed -E 's@.*/@@; s@.*:@@; s@/tcp@@; s@/udp@@' <<<"$port_mapping" | tr -d '"')"
    [[ -z "$container_port" ]] && { log_warn "Parse failure on port mapping: '$port_mapping'"; continue; }

    NEXT_PORT=""; $get_port_function
    local new_port="$NEXT_PORT"
    [[ -z "$new_port" ]] && { log_error "Allocator returned empty host port for $service_name"; continue; }

    log_info "Assign $service_name: host=$new_port -> container=$container_port"
    track_port_use "$new_port" "$service_name" "$container_port" "$is_external"
    port_output="${port_output}\n      - \"${new_port}:${container_port}\""
    ((++port_count))
  done <<< "$port_mappings"

  if (( port_count > 0 )); then
    printf -v CONVERTED_PORTS "%b" "$port_output"
  fi
}

# ---- Copier for service keys (preserve volumes, environment, etc.) ----
copy_service_key_if_present() {
  local service="$1" key="$2"
  local has; has=$(yq eval ".services.${service} | has(\"$key\")" "$SOURCE_COMPOSE" 2>/dev/null || echo "false")
  if [[ "$has" == "true" ]]; then
    echo "    $key:" >> "$OUTPUT_FILE"
    yq eval ".services.${service}.${key}" "$SOURCE_COMPOSE" | sed 's/^/      /' >> "$OUTPUT_FILE"
  fi
}

# ---- Transform volumes to direct TrueNAS bind mounts ----
transform_and_copy_volumes() {
  local service="$1"
  local has_volumes; has_volumes=$(yq eval ".services.${service} | has(\"volumes\")" "$SOURCE_COMPOSE" 2>/dev/null || echo "false")
  
  if [[ "$has_volumes" != "true" ]]; then
    return 0
  fi
  
  echo "    volumes:" >> "$OUTPUT_FILE"
  
  local volume_entries; volume_entries=$(yq eval ".services.${service}.volumes[]" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
  
  while IFS= read -r volume_entry; do
    [[ -z "$volume_entry" || "$volume_entry" == "null" ]] && continue
    
    # Check if this is a named volume (e.g., "pg_data:/var/lib/postgresql/data")
    # or already a bind mount (starts with /)
    if [[ "$volume_entry" =~ ^/ ]] || [[ "$volume_entry" =~ ^\./ ]] || [[ "$volume_entry" =~ ^\.\. ]]; then
      # Already a bind mount or relative path, keep as-is
      echo "      - $volume_entry" >> "$OUTPUT_FILE"
      log_info "Keeping bind mount as-is for ${service}: $volume_entry"
    elif [[ "$volume_entry" =~ ^([a-zA-Z0-9_-]+):(.+)$ ]]; then
      # Named volume reference (e.g., "pg_data:/var/lib/postgresql/data")
      local volume_name="${BASH_REMATCH[1]}"
      local container_path="${BASH_REMATCH[2]}"
      
      # Transform to direct TrueNAS bind mount (unified handling for all services)
      local truenas_path="${BASE_DATA_DIR}/data/${service}/${volume_name}"
      local transformed="${truenas_path}:${container_path}"
      
      echo "      - ${transformed}" >> "$OUTPUT_FILE"
      log_info "Transformed volume for ${service}: ${volume_name} -> ${truenas_path}"
    else
      # Unknown format, keep as-is
      echo "      - $volume_entry" >> "$OUTPUT_FILE"
      log_warn "Unknown volume format for ${service}: $volume_entry"
    fi
  done <<< "$volume_entries"
}

# ======================== Compose Generation ==========================
log_section "Compose File Generation"
log_info "Output file: $OUTPUT_FILE"

# Write 'services:' header
echo "services:" > "$OUTPUT_FILE"

log_subsection "Service Discovery"
services=$(yq eval '.services | keys | .[]' "$SOURCE_COMPOSE")
service_count=$(echo "$services" | wc -l)
log_info "Found $service_count services"

log_subsection "Service Processing"
processed_services=0

while IFS= read -r service; do
  [[ -z "$service" ]] && continue
  processed_services=$((processed_services + 1))
  log_info "Processing $processed_services/$service_count: $service"

  echo "  ${service}:" >> "$OUTPUT_FILE"

  dockerfile=$(yq eval ".services.${service}.build.dockerfile" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
  microservice_name=$(yq eval ".services.${service}.build.args.MICROSERVICE_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")

  if [[ "$dockerfile" != "null" && -n "$dockerfile" ]]; then
    image=$(dockerfile_to_image "$dockerfile" "$service" "$microservice_name")
    echo "    image: $image" >> "$OUTPUT_FILE"
  else
    log_warn "No dockerfile for $service; image not set"
  fi


  restart=$(yq eval ".services.${service}.restart" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
  [[ "$restart" != "null" && -n "$restart" ]] && echo "    restart: $restart" >> "$OUTPUT_FILE"

  # Always copy pull_policy if present (even if null or empty)
  has_pull_policy=$(yq eval ".services.${service} | has(\"pull_policy\")" "$SOURCE_COMPOSE" 2>/dev/null || echo "false")
  if [[ "$has_pull_policy" == "true" ]]; then
    pull_policy=$(yq eval ".services.${service}.pull_policy" "$SOURCE_COMPOSE" 2>/dev/null)
    echo "    pull_policy: $pull_policy" >> "$OUTPUT_FILE"
  fi

  # Always copy healthcheck if present
  has_healthcheck=$(yq eval ".services.${service} | has(\"healthcheck\")" "$SOURCE_COMPOSE" 2>/dev/null || echo "false")
  if [[ "$has_healthcheck" == "true" ]]; then
    echo "    healthcheck:" >> "$OUTPUT_FILE"
    yq eval ".services.${service}.healthcheck" "$SOURCE_COMPOSE" | sed 's/^/      /' >> "$OUTPUT_FILE"
  fi

  port_function=$(get_port_function_for_service "$service" "$dockerfile")
  convert_ports "$service" "$port_function"
  [[ -n "$CONVERTED_PORTS" ]] && echo "$CONVERTED_PORTS" >> "$OUTPUT_FILE"

  # Preserve critical service blocks, but **intentionally skip networks and volumes**
  # Volumes are handled separately with transformation
  for key in environment expose extra_hosts healthcheck user ulimits tmpfs command entrypoint; do
    copy_service_key_if_present "$service" "$key"
  done
  
  # Transform and copy volumes with TrueNAS bind mounts
  transform_and_copy_volumes "$service"

  # depends_on (force all to map with condition: service_started)
  has_depends_on=$(yq eval ".services.${service} | has(\"depends_on\")" "$SOURCE_COMPOSE" 2>/dev/null || echo "false")
  if [[ "$has_depends_on" == "true" ]]; then
    echo "    depends_on:" >> "$OUTPUT_FILE"
    # Robustly extract dependency names regardless of type
    deps_type=$(yq eval ".services.${service}.depends_on | type" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    deps_list=""
    if [[ "$deps_type" == "!!seq" || "$deps_type" == "array" ]]; then
      deps_list=$(yq eval ".services.${service}.depends_on[]" "$SOURCE_COMPOSE" 2>/dev/null || true)
    elif [[ "$deps_type" == "!!map" || "$deps_type" == "map" ]]; then
      deps_list=$(yq eval ".services.${service}.depends_on | keys | .[]" "$SOURCE_COMPOSE" 2>/dev/null || true)
    fi
    while IFS= read -r dep; do
      [[ -z "$dep" || "$dep" == "null" ]] && continue
      echo "      ${dep}:" >> "$OUTPUT_FILE"
      echo "        condition: service_started" >> "$OUTPUT_FILE"
    done <<< "$deps_list"
  fi

  echo "" >> "$OUTPUT_FILE"
done <<< "$services"

# ======================== Top-level sections (networks intentionally skipped) ==========================
log_subsection "Skipping top-level volumes and networks (using direct bind mounts)"
log_info "Skipping top-level networks import by design"
log_info "Volumes are now direct TrueNAS bind mounts in service definitions"
# No top-level volumes section needed - all volumes are direct bind mounts in services


# ======================== Summary & Sanity Reports ==========================
log_section "Generation Summary"
log_info "Generated: $OUTPUT_FILE"
log_info "Processed services: $processed_services"
log_info "External ports used: $external_counter/$external_count"
log_info "Internal ports used: $internal_counter/$internal_count"

if command -v yq &>/dev/null; then
  if yq eval '.' "$OUTPUT_FILE" >/dev/null 2>&1; then
    log_info "YAML validation: OK"
  else
    log_warn "YAML validation: FAILED"
  fi
fi

if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
  log_subsection "Generated Compose (first 200 lines)"
  head -n 200 "$OUTPUT_FILE" | while IFS= read -r line; do log_info "$line"; done
fi

log_timer

# ======================== External Ports Map (STDOUT) ==========================
ports_sorted=($(printf "%s\n" "${!USED_EXTERNAL_PORTS[@]}" | sort -n))
json="{"
first=true
for p in "${ports_sorted[@]}"; do
  [[ -z "$p" ]] && continue
  val=${USED_EXTERNAL_PORTS[$p]}
  if [[ "$first" == "true" ]]; then first=false; else json+=","; fi
  json+="\"$p\":\"$val\""
done
json+="}"
echo "$json"
