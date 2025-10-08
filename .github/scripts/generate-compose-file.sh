#!/bin/bash
# Script to generate Docker Compose file with GHCR images based on existing compose file
# Usage: ./generate-compose-file.sh "internal_ports" "external_ports" "docker_tag" "repo_owner" "repo_name" "data_base_dir"

# --- Strict mode + inherit ERR in functions/subshells ---
set -Eeuo pipefail   # -E is critical so the ERR trap works inside functions

# ======================== Advanced Logging Config ==========================
LOG_LEVEL="${LOG_LEVEL:-INFO}"   # DEBUG|INFO|WARN|ERROR
LOG_FILE="${LOG_FILE:-generate-compose-$(date +%Y%m%d_%H%M%S).log}"
ENABLE_FILE_LOGGING="${ENABLE_FILE_LOGGING:-true}"
ENABLE_SHELL_XTRACE="${ENABLE_SHELL_XTRACE:-false}"  # set true when LOG_LEVEL=DEBUG to see PS4 trace

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
  # Print logs to STDERR so they never contaminate command substitutions
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

# --- Robust ERR handler that logs the command and status exactly ---
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
  echo "Example: $0 \"40000-49999\" \"50008-60000\" \"dev-abc123\" \"owner\" \"repo\" \"Files/Apps/DJPanel/dev\" \"dj-panel-composer-dev-abc123.yml\""
  exit 1
fi
INTERNAL_PORTS="$1"
EXTERNAL_PORTS="$2"
DOCKER_TAG="$3"
REPO_OWNER="$4"
REPO_NAME="$5"
DATA_BASE_DIR="$6"
OUTPUT_FILE="$7"

log_section "Script Initialization"
log_info "Starting Docker Compose file generation"
log_info "Log level: $LOG_LEVEL"
log_info "Log file: $LOG_FILE"
log_info "File logging: $ENABLE_FILE_LOGGING"

validate_inputs
_enable_shell_xtrace

# ======================== Globals & Helpers ==========================
SOURCE_COMPOSE="Docker/dj-panel-composer.yml"

log_subsection "Source File Validation"
if [ ! -f "$SOURCE_COMPOSE" ]; then
  log_error "Source compose file $SOURCE_COMPOSE not found"
  log_error "Current directory: $(pwd)"
  log_error "Available files in Docker/: $(ls -la Docker/ 2>/dev/null || echo 'Directory not found')"
  exit 1
fi
log_info "Source compose file found: $SOURCE_COMPOSE"

log_subsection "Port Configuration"
# Split space-separated inputs (can be large)
read -ra INTERNAL_PORT_ARRAY <<< "$INTERNAL_PORTS"
read -ra EXTERNAL_PORT_ARRAY <<< "$EXTERNAL_PORTS"
internal_count=${#INTERNAL_PORT_ARRAY[@]}
external_count=${#EXTERNAL_PORT_ARRAY[@]}
log_info "Internal ports available: $internal_count ports"
log_info "External ports available: $external_count ports"
if (( internal_count > 10 )); then
  log_info "Internal ports range: ${INTERNAL_PORT_ARRAY[0]}-${INTERNAL_PORT_ARRAY[$((internal_count-1))]}"
else
  log_info "Internal ports: ${INTERNAL_PORT_ARRAY[*]}"
fi
if (( external_count > 10 )); then
  log_info "External ports range: ${EXTERNAL_PORT_ARRAY[0]}-${EXTERNAL_PORT_ARRAY[$((external_count-1))]}"
else
  log_info "External ports: ${EXTERNAL_PORT_ARRAY[*]}"
fi
(( internal_count == 0 )) && log_warn "No internal ports provided"
(( external_count == 0 )) && log_warn "No external ports provided"

# Counters and buffers
: $((internal_counter=0))   # safe with set -e
: $((external_counter=0))
NEXT_PORT=""; CONVERTED_PORTS=""
declare -A USED_HOST_PORTS
declare -A USED_EXTERNAL_PORTS   # hostPort -> "service:containerPort" (append comma for multiples)

track_port_use() {
  local host="$1" service="$2" cport="$3" is_external="${4:-false}"
  if [[ -n "${USED_HOST_PORTS[$host]:-}" ]]; then
    log_warn "Duplicate host port detected: $host (already used by ${USED_HOST_PORTS[$host]}; now ${service}:${cport})"
    USED_HOST_PORTS["$host"]+=",${service}:${cport}"
  else
    USED_HOST_PORTS["$host"]="${service}:${cport}"
  fi
  if [[ "$is_external" == "true" ]]; then
    if [[ -n "${USED_EXTERNAL_PORTS[$host]:-}" ]]; then
      USED_EXTERNAL_PORTS["$host"]+=",${service}:${cport}"
    else
      USED_EXTERNAL_PORTS["$host"]="${service}:${cport}"
    fi
  fi
}

# --- Allocators (safe with set -e) ---
get_next_internal_port() {
  log_debug "INT alloc BEFORE: idx=${internal_counter}/${internal_count}"
  if (( internal_counter < internal_count )); then
    local port="${INTERNAL_PORT_ARRAY[$internal_counter]}"
    ((++internal_counter))               # pre-increment avoids exit status 1 when starting at 0
    NEXT_PORT="$port"
  else
    log_warn "INT alloc exhausted; fallback 40000"
    NEXT_PORT="40000"
  fi
  log_debug "INT alloc AFTER: idx=${internal_counter}, NEXT_PORT=$NEXT_PORT"
}

get_next_external_port() {
  log_debug "EXT alloc BEFORE: idx=${external_counter}/${external_count}"
  if (( external_counter < external_count )); then
    local port="${EXTERNAL_PORT_ARRAY[$external_counter]}"
    ((++external_counter))               # pre-increment avoids exit status 1 when starting at 0
    NEXT_PORT="$port"
  else
    log_warn "EXT alloc exhausted; fallback 50000"
    NEXT_PORT="50000"
  fi
  log_debug "EXT alloc AFTER: idx=${external_counter}, NEXT_PORT=$NEXT_PORT"
}

# Policy: infra uses internal ports (except strapi), apps/frontends use external
get_port_function_for_service() {
  local service_name="$1" dockerfile="$2"
  if [[ "$dockerfile" == Docker/infra/* ]]; then
    if [[ "$service_name" == "strapi" ]]; then
      log_debug "Policy[$service_name]: external (infra exception)"
      echo "get_next_external_port"
    else
      log_debug "Policy[$service_name]: internal (infra)"
      echo "get_next_internal_port"
    fi
  else
    log_debug "Policy[$service_name]: external (apps/frontends)"
    echo "get_next_external_port"
  fi
}

dockerfile_to_image() {
  local dockerfile="$1" service_name="$2" microservice_name="$3"
  local dockerfile_dir; dockerfile_dir=$(dirname "$dockerfile" | sed 's|Docker/||')
  local dockerfile_base; dockerfile_base=$(basename "$dockerfile" .Dockerfile)
  local image_name
  if [[ "$dockerfile" == Docker/infra/* ]]; then
    image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/infra/${dockerfile_base}:${DOCKER_TAG}"
  elif [[ "$dockerfile" == Docker/services/* ]]; then
    if [[ -n "$microservice_name" && "$microservice_name" != "null" ]]; then
      image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/services/${microservice_name}:${DOCKER_TAG}"
    else
      image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/services/${dockerfile_base}:${DOCKER_TAG}"
    fi
  elif [[ "$dockerfile" == Docker/frontends/* || "$dockerfile" == *react.Dockerfile ]]; then
    local microfrontend_name
    microfrontend_name=$(yq eval ".services.${service_name}.build.args.MICROFRONTEND_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [[ -n "$microfrontend_name" && "$microfrontend_name" != "null" ]]; then
      image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/frontends/${microfrontend_name}:${DOCKER_TAG}"
    else
      image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/frontends/${service_name}:${DOCKER_TAG}"
    fi
  else
    log_warn "Unknown dockerfile pattern for $service_name; generic path"
    image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/${dockerfile_dir}/${dockerfile_base}:${DOCKER_TAG}"
  fi
  log_debug "Image[$service_name] -> $image_name"
  echo "$image_name"
}

# --- Helpers for volume rewriting ---
trim_slashes() { local p="$1"; p="${p#/}"; p="${p%/}"; echo "$p"; }

should_rewrite_to_data_dir() {
  # Returns 0 (true) if source is a named/relative volume → rewrite to DATA_BASE_DIR
  # Absolute paths or special sockets should not be rewritten.
  local src="$1"
  [[ -z "$src" ]] && return 1
  [[ "$src" == /* ]] && return 1   # absolute host bind: keep
  [[ "$src" == .* ]] && return 0   # relative path: rewrite
  [[ "$src" == *docker.sock* ]] && return 1
  # If it contains a '/', treat as path (relative); else treat as named volume.
  if [[ "$src" == */* ]]; then
    return 0   # relative like ./data or some/path
  fi
  return 0     # named volume (no slashes) -> rewrite
}

rewrite_volume_line() {
  # Input: short syntax "src:target[:mode]" OR just "target" (rare). Output rewritten short-syntax line.
  local service="$1"; local line="$2"

  # Strip quotes
  line="${line%\"}"; line="${line#\"}"

  # If no colon at all, it's a "target only" which is unusual; create a bind based on target
  if [[ "$line" != *:* ]]; then
    local tgt="$line"
    local subdir
    subdir=$(trim_slashes "$tgt")
    local new_src="${DATA_BASE_DIR%/}/${service}/${subdir}"
    echo "${new_src}:${tgt}"
    return 0
  fi

  # Split into up to 3 fields: src : tgt [: mode]
  local src tgt mode
  IFS=':' read -r src tgt mode <<< "$line"

  # Reassemble handling extra colons in mode (unlikely) — we only care about up to 3 fields
  [[ -z "$tgt" ]] && { echo "$line"; return 0; }

  if should_rewrite_to_data_dir "$src"; then
    local subdir
    subdir=$(trim_slashes "$tgt")
    local new_src="${DATA_BASE_DIR%/}/${service}/${subdir}"
    if [[ -n "$mode" ]]; then
      echo "${new_src}:${tgt}:${mode}"
    else
      echo "${new_src}:${tgt}"
    fi
  else
    # Keep original bind (absolute paths / docker.sock / etc.)
    echo "$line"
  fi
}

# --- Convert ports for a service (writes YAML to CONVERTED_PORTS) ---
convert_ports() {
  local service_name="$1" get_port_function="$2"
  CONVERTED_PORTS=""
  log_debug "convert_ports(): $service_name using=$get_port_function (counters: INT=${internal_counter}/${internal_count}, EXT=${external_counter}/${external_count})"
  local is_external="false"
  [[ "$get_port_function" == "get_next_external_port" ]] && is_external="true"

  local has_ports; has_ports=$(yq eval ".services.${service_name} | has(\"ports\")" "$SOURCE_COMPOSE" 2>/dev/null)
  [[ "$has_ports" != "true" ]] && { log_debug "No ports key for $service_name"; return 0; }

  local port_output="    ports:"; local port_count=0
  local port_mappings; port_mappings=$(yq eval ".services.${service_name}.ports[]" "$SOURCE_COMPOSE" 2>/dev/null)

  while IFS= read -r port_mapping; do
    log_debug "Raw mapping[$service_name]: '$port_mapping'"
    [[ -z "$port_mapping" || "$port_mapping" == "null" ]] && { log_warn "Empty mapping for $service_name"; continue; }

    # Extract container port (strip quotes, handle 0.0.0.0:HOST:CONTAINER[/proto])
    local container_port
    container_port="$(sed -E 's@.*/@@; s@.*:@@; s@/tcp@@; s@/udp@@' <<<"$port_mapping" | tr -d '"')"
    [[ -z "$container_port" ]] && { log_warn "Parse failure: '$port_mapping'"; continue; }

    NEXT_PORT=""
    $get_port_function
    local new_port="$NEXT_PORT"
    [[ -z "$new_port" ]] && { log_error "Allocator returned empty host port for $service_name"; continue; }

    log_info "Assign $service_name: host=$new_port -> container=$container_port (allocator=$get_port_function)"
    track_port_use "$new_port" "$service_name" "$container_port" "$is_external"

    port_output="${port_output}\n      - \"${new_port}:${container_port}\""
    ((++port_count))
    log_debug "After assign: INT=${internal_counter}/${internal_count}, EXT=${external_counter}/${external_count}"
  done <<< "$port_mappings"

  if (( port_count > 0 )); then
    printf -v CONVERTED_PORTS "%b" "$port_output"
    log_debug "convert_ports(): wrote $port_count mappings for $service_name"
  else
    log_warn "convert_ports(): 0 mappings for $service_name"
  fi
}

# --- Allocator self-test (DEBUG only) ---
if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
  log_subsection "Allocator self-check (first 3 each)"
  NEXT_PORT=""; get_next_internal_port; log_debug "INT#1=$NEXT_PORT"
  NEXT_PORT=""; get_next_internal_port; log_debug "INT#2=$NEXT_PORT"
  NEXT_PORT=""; get_next_external_port; log_debug "EXT#1=$NEXT_PORT"
  NEXT_PORT=""; get_next_external_port; log_debug "EXT#2=$NEXT_PORT"
  # roll back counters without tripping set -e on zero
  : $((internal_counter-=2))
  : $((external_counter-=2))
  log_debug "Counters reset after self-check: INT=$internal_counter, EXT=$external_counter"
fi

# ======================== Compose Generation ==========================
log_section "Compose File Generation"
log_info "Output file: $OUTPUT_FILE"
log_info "Reading source compose file: $SOURCE_COMPOSE"

{
  echo "services:"
} > "$OUTPUT_FILE"

log_subsection "Service Discovery"
services=$(yq eval '.services | keys | .[]' "$SOURCE_COMPOSE")
service_count=$(echo "$services" | wc -l)
log_info "Found $service_count services to process"

log_subsection "Service Processing"
processed_services=0

while IFS= read -r service; do
  [[ -z "$service" ]] && continue
  processed_services=$((processed_services + 1))
  log_info "Processing $processed_services/$service_count: $service"
  log_debug "Loop start counters: INT=${internal_counter}/${internal_count}, EXT=${external_counter}/${external_count}"

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

  pull_policy=$(yq eval ".services.${service}.pull_policy" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
  [[ "$pull_policy" != "null" && -n "$pull_policy" ]] && echo "    pull_policy: $pull_policy" >> "$OUTPUT_FILE"

  port_function=$(get_port_function_for_service "$service" "$dockerfile")
  log_info "Allocator for $service: $port_function"
  convert_ports "$service" "$port_function"
  if [[ -n "$CONVERTED_PORTS" ]]; then
    echo "$CONVERTED_PORTS" >> "$OUTPUT_FILE"
  else
    log_debug "$service has no ports to write"
  fi

  # --- Volumes (rewrite named/relative sources to DATA_BASE_DIR/service/<target-subdir>) ---
  volumes=$(yq eval ".services.${service}.volumes[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
  if [[ -n "$volumes" ]]; then
    echo "    volumes:" >> "$OUTPUT_FILE"
    while IFS= read -r volume; do
      [[ -z "$volume" ]] && continue
      local_out=$(rewrite_volume_line "$service" "$volume")
      echo "      - ${local_out}" >> "$OUTPUT_FILE"
      if [[ "$local_out" != "$volume" ]]; then
        log_info "Volume rewritten for $service: '$volume' -> '$local_out'"
      else
        log_debug "Volume kept for $service: '$volume'"
      fi
    done <<< "$volumes"
  fi

  depends_on=$(yq eval ".services.${service}.depends_on" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
  if [[ "$depends_on" != "null" && "$depends_on" != "{}" && -n "$depends_on" ]]; then
    echo "    depends_on:" >> "$OUTPUT_FILE"
    yq eval ".services.${service}.depends_on" "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/      /' >> "$OUTPUT_FILE"
  fi

  echo "" >> "$OUTPUT_FILE"
  log_debug "Completed $service; counters now: INT=${internal_counter}/${internal_count}, EXT=${external_counter}/${external_count}"
done <<< "$services"

# ======================== Summary & Sanity Reports ==========================
log_section "Generation Summary"
log_info "Successfully generated Docker Compose file: $OUTPUT_FILE"
log_info "Processed $processed_services services"
log_info "External ports used: $external_counter/$external_count"
log_info "Internal ports used: $internal_counter/$internal_count"

if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
  log_subsection "Assigned host ports (first 20)"
  i=0
  for p in "${!USED_HOST_PORTS[@]}"; do
    log_debug "Host $p -> ${USED_HOST_PORTS[$p]}"
    (( ++i >= 20 )) && break
  done
fi

if [[ -f "$OUTPUT_FILE" ]]; then
  file_size=$(wc -l < "$OUTPUT_FILE")
  log_info "Generated file size: $file_size lines"
fi

if command -v yq &>/dev/null; then
  if yq eval '.' "$OUTPUT_FILE" >/dev/null 2>&1; then
    log_info "Generated file passed YAML syntax validation"
  else
    log_warn "Generated file has YAML syntax issues"
  fi
fi

# Optionally show final file content (only in DEBUG to avoid huge logs)
log_subsection "Generated Compose File Content"
log_info "Final compose file contents (DEBUG mode):"
log_info "----------------------------------------"
while IFS= read -r line; do
  log_info "$line"
done < "$OUTPUT_FILE"
log_info "----------------------------------------"

log_timer
log_info "Docker Compose file generation completed"

# ======================== External Ports Map (STDOUT) ==========================
# Emit a machine-readable JSON object mapping EXTERNAL host ports to "service:containerPort"
# Logs go to STDERR, so this is clean to capture in CI with $GITHUB_OUTPUT if desired.
ports_sorted=($(printf "%s\n" "${!USED_EXTERNAL_PORTS[@]}" | sort -n))
json="{"
first=true
for p in "${ports_sorted[@]}"; do
  [[ -z "$p" ]] && continue
  val=${USED_EXTERNAL_PORTS[$p]}
  if [[ "$first" == true ]]; then
    first=false
  else
    json+=","
  fi
  json+="\"$p\":\"$val\""
done
json+="}"
echo "$json"
