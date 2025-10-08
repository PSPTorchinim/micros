#!/bin/bash 

# Script to generate Docker Compose file with GHCR images based on existing compose file
# Usage: ./generate-compose-file.sh "internal_ports" "external_ports" "docker_tag" "repo_owner" "repo_name"

set -euo pipefail

# ======================== Advanced Logging Config ==========================
LOG_LEVEL="${LOG_LEVEL:-INFO}"   # DEBUG|INFO|WARN|ERROR
LOG_FILE="${LOG_FILE:-generate-compose-$(date +%Y%m%d_%H%M%S).log}"
ENABLE_FILE_LOGGING="${ENABLE_FILE_LOGGING:-true}"
# When true and LOG_LEVEL=DEBUG, prints bash xtrace with timestamps + function + line no.
ENABLE_SHELL_XTRACE="${ENABLE_SHELL_XTRACE:-true}"

# Color codes for console output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Adds caller location (function:line) to messages
_log_location() {
  local depth="${1:-1}"
  local info
  info=$(caller "$depth" 2>/dev/null || true)
  # format: "LINE FUNC SOURCE"
  if [[ -n "$info" ]]; then
    # shellcheck disable=SC2206
    local parts=($info)
    local line="${parts[0]}"
    local func="${parts[1]:-main}"
    local file="${parts[2]:-$(basename "$0")}"
    echo "$file:$func:$line"
  else
    echo "$(basename "$0"):main:?"
  fi
}

log_message() {
    local level="$1"
    local message="$2"
    local color="${3:-$NC}"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local loc
    loc="$(_log_location 2)" # 2 frames up so logs point to the caller site

    # Console output with color
    echo -e "${color}[${timestamp}] [${level}] [$loc] ${message}${NC}"
    # File logging (without color codes)
    if [[ "$ENABLE_FILE_LOGGING" == "true" ]]; then
        echo "[${timestamp}] [${level}] [$loc] ${message}" >> "$LOG_FILE"
    fi
}

log_debug() { [[ "$LOG_LEVEL" == "DEBUG" ]] && log_message "DEBUG" "$1" "$CYAN"; }
log_info()  { [[ "$LOG_LEVEL" =~ ^(DEBUG|INFO)$ ]] && log_message "INFO"  "$1" "$GREEN"; }
log_warn()  { [[ "$LOG_LEVEL" =~ ^(DEBUG|INFO|WARN)$ ]] && log_message "WARN"  "$1" "$YELLOW"; }
log_error() { log_message "ERROR" "$1" "$RED"; }

log_section()    { log_info "==================== $1 ===================="; }
log_subsection() { log_info "---------- $1 ----------"; }

# Optional: bash xtrace (very verbose). Only enable for deep debugging.
_enable_shell_xtrace() {
  if [[ "$LOG_LEVEL" == "DEBUG" && "$ENABLE_SHELL_XTRACE" == "true" ]]; then
    export PS4='+ $(date "+%Y-%m-%d %H:%M:%S") [$(_log_location 1)] >> '
    set -x
  fi
}

# Performance timing
start_time=$(date +%s)
log_timer() {
    local current_time
    current_time=$(date +%s)
    local elapsed=$((current_time - start_time))
    log_info "Total execution time: ${elapsed}s"
}

# Error handling function
handle_error() {
    local line_number="$1"
    local exit_code=$?
    log_error "Script failed at line $line_number"
    log_error "Last command exit code: $exit_code"
    log_timer
    exit 1
}
trap 'handle_error $LINENO' ERR

# ======================== Input Handling ==========================

validate_inputs() {
    log_section "Input Validation"
    if [[ -z "$INTERNAL_PORTS" ]]; then log_error "Internal ports parameter is empty"; exit 1; fi
    if [[ -z "$EXTERNAL_PORTS" ]]; then log_error "External ports parameter is empty"; exit 1; fi
    if [[ -z "$DOCKER_TAG"     ]]; then log_error "Docker tag parameter is empty"; exit 1; fi
    if [[ -z "$REPO_OWNER"     ]]; then log_error "Repository owner parameter is empty"; exit 1; fi
    if [[ -z "$REPO_NAME"      ]]; then log_error "Repository name parameter is empty"; exit 1; fi
    log_info "Input validation passed"
}

if [ $# -ne 5 ]; then
    echo "Usage: $0 \"internal_ports\" \"external_ports\" \"docker_tag\" \"repo_owner\" \"repo_name\""
    echo "Example: $0 \"40000-49999\" \"50008-60000\" \"dev-abc123\" \"owner\" \"repo\""
    exit 1
fi

INTERNAL_PORTS="$1"
EXTERNAL_PORTS="$2"
DOCKER_TAG="$3"
REPO_OWNER="$4"
REPO_NAME="$5"

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
# Arrays built from space-separated lists
read -ra INTERNAL_PORT_ARRAY <<< "$INTERNAL_PORTS"
read -ra EXTERNAL_PORT_ARRAY <<< "$EXTERNAL_PORTS"
internal_count=${#INTERNAL_PORT_ARRAY[@]}
external_count=${#EXTERNAL_PORT_ARRAY[@]}
log_info "Internal ports available: $internal_count ports"
log_info "External ports available: $external_count ports"

if [[ $internal_count -gt 10 ]]; then
    log_info "Internal ports range: ${INTERNAL_PORT_ARRAY[0]}-${INTERNAL_PORT_ARRAY[$((internal_count-1))]}"
else
    log_info "Internal ports: ${INTERNAL_PORT_ARRAY[*]}"
fi
if [[ $external_count -gt 10 ]]; then
    log_info "External ports range: ${EXTERNAL_PORT_ARRAY[0]}-${EXTERNAL_PORT_ARRAY[$((external_count-1))]}"
else
    log_info "External ports: ${EXTERNAL_PORT_ARRAY[*]}"
fi

if [[ $internal_count -eq 0 ]]; then log_warn "No internal ports provided"; fi
if [[ $external_count -eq 0 ]]; then log_warn "No external ports provided"; fi

# Counters and "return" buffers
internal_counter=0
external_counter=0
NEXT_PORT=""
CONVERTED_PORTS=""

# Track used host ports to catch duplicates and where they were assigned
declare -A USED_HOST_PORTS   # key: host_port, value: "service:container_port"
track_port_use() {
  local host="$1" service="$2" cport="$3"
  if [[ -n "${USED_HOST_PORTS[$host]:-}" ]]; then
    log_warn "Duplicate host port detected: $host (already used by ${USED_HOST_PORTS[$host]}; now requested by ${service}:${cport})"
  else
    USED_HOST_PORTS["$host"]="${service}:${cport}"
  fi
}

log_debug "Initial counters: internal_counter=$internal_counter, external_counter=$external_counter"

# ======================== Port Pickers with Deep Logging ==========================

get_next_internal_port() {
    log_debug "get_next_internal_port(): before: internal_counter=$internal_counter/$internal_count"
    if (( internal_counter < internal_count )); then
        local port="${INTERNAL_PORT_ARRAY[$internal_counter]}"
        log_debug "Assign internal port = $port (idx=$internal_counter)"
        ((internal_counter++))
        NEXT_PORT="$port"
    else
        log_warn "No more internal ports available, using fallback: 40000"
        NEXT_PORT="40000"
    fi
    log_debug "get_next_internal_port(): after: internal_counter=$internal_counter, NEXT_PORT=$NEXT_PORT"
}

get_next_external_port() {
    log_debug "get_next_external_port(): before: external_counter=$external_counter/$external_count"
    if (( external_counter < external_count )); then
        local port="${EXTERNAL_PORT_ARRAY[$external_counter]}"
        log_debug "Assign external port = $port (idx=$external_counter)"
        ((external_counter++))
        NEXT_PORT="$port"
    else
        log_warn "No more external ports available, using fallback: 50000"
        NEXT_PORT="50000"
    fi
    log_debug "get_next_external_port(): after: external_counter=$external_counter, NEXT_PORT=$NEXT_PORT"
}

get_port_function_for_service() {
    local service_name="$1"
    local dockerfile="$2"
    if [[ "$dockerfile" == Docker/infra/* ]]; then
        if [[ "$service_name" == "strapi" ]]; then
            log_debug "Port policy: $service_name (infra but Strapi) -> external ports"
            echo "get_next_external_port"
        else
            log_debug "Port policy: $service_name (infra) -> internal ports"
            echo "get_next_internal_port"
        fi
    else
        log_debug "Port policy: $service_name (apps/frontend) -> external ports"
        echo "get_next_external_port"
    fi
}

# ======================== Image Name Resolver ==========================

dockerfile_to_image() {
    local dockerfile="$1"
    local service_name="$2"
    local microservice_name="$3"
    log_debug "dockerfile_to_image for $service_name dockerfile=$dockerfile microservice_name=$microservice_name"

    local dockerfile_dir
    dockerfile_dir=$(dirname "$dockerfile" | sed 's|Docker/||')
    local dockerfile_base
    dockerfile_base=$(basename "$dockerfile" .Dockerfile)

    local image_name=""
    if [[ "$dockerfile" == Docker/infra/* ]]; then
        image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/infra/${dockerfile_base}:${DOCKER_TAG}"
    elif [[ "$dockerfile" == Docker/services/* ]]; then
        if [ -n "$microservice_name" ] && [ "$microservice_name" != "null" ]; then
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/services/${microservice_name}:${DOCKER_TAG}"
        else
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/services/${dockerfile_base}:${DOCKER_TAG}"
        fi
    elif [[ "$dockerfile" == Docker/frontends/* ]] || [[ "$dockerfile" == *react.Dockerfile ]]; then
        local microfrontend_name
        microfrontend_name=$(yq eval ".services.${service_name}.build.args.MICROFRONTEND_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
        if [ -n "$microfrontend_name" ] && [ "$microfrontend_name" != "null" ]; then
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/frontends/${microfrontend_name}:${DOCKER_TAG}"
        else
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/frontends/${service_name}:${DOCKER_TAG}"
        fi
    else
        image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/${dockerfile_dir}/${dockerfile_base}:${DOCKER_TAG}"
        log_warn "Unknown dockerfile pattern for $service_name; using generic image path"
    fi
    log_debug "Resolved image for $service_name -> $image_name"
    echo "$image_name"
}

# ======================== Port Conversion with Surgical Logging ==========================

# Writes output YAML snippet to CONVERTED_PORTS (no echo; avoid subshells)
convert_ports() {
    local service_name="$1"
    local get_port_function="$2"
    CONVERTED_PORTS=""

    log_debug "convert_ports(): service=$service_name using=$get_port_function (counters: int=${internal_counter}/${internal_count}, ext=${external_counter}/${external_count})"

    local has_ports
    has_ports=$(yq eval ".services.${service_name} | has(\"ports\")" "$SOURCE_COMPOSE" 2>/dev/null)

    if [[ "$has_ports" != "true" ]]; then
        log_debug "No 'ports' key for $service_name"
        return 0
    fi

    local port_output="    ports:"
    local port_count=0
    local port_mappings
    port_mappings=$(yq eval ".services.${service_name}.ports[]" "$SOURCE_COMPOSE" 2>/dev/null)

    # We log each line to pinpoint where parsing/assignment fails
    while IFS= read -r port_mapping; do
        log_debug "Raw port mapping line for $service_name: '$port_mapping'"
        if [[ -z "$port_mapping" || "$port_mapping" == "null" ]]; then
            log_warn "Empty/null port mapping encountered for $service_name; skipping"
            continue
        fi

        local container_port
        container_port="$(sed -E 's@.*/@@; s@.*:@@; s@/tcp@@; s@/udp@@' <<<"$port_mapping" | tr -d '"')"
        if [[ -z "$container_port" ]]; then
            log_warn "Failed to parse container_port from '$port_mapping' for $service_name"
            continue
        fi
        log_debug "Parsed container_port for $service_name: $container_port (from '$port_mapping')"

        NEXT_PORT=""
        $get_port_function
        local new_port="$NEXT_PORT"

        if [[ -z "$new_port" ]]; then
            log_error "No host port returned for $service_name mapping '$port_mapping'"
            continue
        fi

        log_info "Assigning $service_name host_port=$new_port -> container_port=$container_port (policy=$get_port_function)"
        track_port_use "$new_port" "$service_name" "$container_port"

        port_output="${port_output}\n      - \"${new_port}:${container_port}\""
        ((port_count++))

        # After each assignment, show live counters to catch reset bugs
        log_debug "Post-assignment counters: internal=${internal_counter}/${internal_count}, external=${external_counter}/${external_count}"
    done <<< "$port_mappings"

    if (( port_count > 0 )); then
        printf -v CONVERTED_PORTS "%b" "$port_output"
        log_debug "convert_ports(): produced $port_count mappings for $service_name"
    else
        log_warn "convert_ports(): no mappings produced for $service_name"
    fi
}

# ======================== Compose Generation ==========================

OUTPUT_FILE="dj-panel-composer-${DOCKER_TAG}.yml"

log_section "Compose File Generation"
log_info "Output file: $OUTPUT_FILE"
log_info "Reading source compose file: $SOURCE_COMPOSE"

{
  echo "name: djpanel"
  echo ""
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
    log_info "Processing service $processed_services/$service_count: $service"
    log_debug "Service loop counters at start: internal=${internal_counter}/${internal_count}, external=${external_counter}/${external_count}"

    echo "  ${service}:" >> "$OUTPUT_FILE"

    dockerfile=$(yq eval ".services.${service}.build.dockerfile" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    microservice_name=$(yq eval ".services.${service}.build.args.MICROSERVICE_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    log_debug "Service $service dockerfile=$dockerfile microservice_name=$microservice_name"

    if [ "$dockerfile" != "null" ] && [ -n "$dockerfile" ]; then
        image=$(dockerfile_to_image "$dockerfile" "$service" "$microservice_name")
        echo "    image: $image" >> "$OUTPUT_FILE"
    else
        log_warn "No dockerfile found for $service; image not set"
    fi

    restart=$(yq eval ".services.${service}.restart" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    [[ "$restart" != "null" && -n "$restart" ]] && echo "    restart: $restart" >> "$OUTPUT_FILE"

    pull_policy=$(yq eval ".services.${service}.pull_policy" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    [[ "$pull_policy" != "null" && -n "$pull_policy" ]] && echo "    pull_policy: $pull_policy" >> "$OUTPUT_FILE"

    port_function=$(get_port_function_for_service "$service" "$dockerfile")
    log_info "Service $service will use port allocator: $port_function"

    convert_ports "$service" "$port_function"
    if [ -n "$CONVERTED_PORTS" ]; then
        echo "$CONVERTED_PORTS" >> "$OUTPUT_FILE"
    else
        log_debug "Service $service has no ports section to write"
    fi

    expose=$(yq eval ".services.${service}.expose[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [ -n "$expose" ]; then
        echo "    expose:" >> "$OUTPUT_FILE"
        while IFS= read -r port; do
            [[ -z "$port" || "$port" == "null" ]] && continue
            echo "      - \"$port\"" >> "$OUTPUT_FILE"
        done <<< "$expose"
    fi

    depends_on=$(yq eval ".services.${service}.depends_on" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    if [ "$depends_on" != "null" ] && [ "$depends_on" != "{}" ] && [ -n "$depends_on" ]; then
        echo "    depends_on:" >> "$OUTPUT_FILE"
        yq eval ".services.${service}.depends_on" "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/      /' >> "$OUTPUT_FILE"
    fi

    networks=$(yq eval ".services.${service}.networks[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [ -n "$networks" ]; then
        echo "    networks:" >> "$OUTPUT_FILE"
        while IFS= read -r network; do
            [[ -z "$network" ]] && continue
            echo "      - $network" >> "$OUTPUT_FILE"
        done <<< "$networks"
    fi

    volumes=$(yq eval ".services.${service}.volumes[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [ -n "$volumes" ]; then
        echo "    volumes:" >> "$OUTPUT_FILE"
        while IFS= read -r volume; do
            [[ -z "$volume" ]] && continue
            echo "      - $volume" >> "$OUTPUT_FILE"
        done <<< "$volumes"
    fi

    echo "" >> "$OUTPUT_FILE"
    log_debug "Completed $service with counters: internal=${internal_counter}/${internal_count}, external=${external_counter}/${external_count}"

done <<< "$services"

# ======================== Footer Sections ==========================

log_subsection "Adding Networks Configuration"
networks_section=$(yq eval '.networks' "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
if [ "$networks_section" != "null" ] && [ -n "$networks_section" ]; then
    echo "networks:" >> "$OUTPUT_FILE"
    yq eval '.networks' "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
else
    log_debug "No networks configuration found"
fi

log_subsection "Adding Volumes Configuration"
volumes_section=$(yq eval '.volumes' "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
if [ "$volumes_section" != "null" ] && [ -n "$volumes_section" ]; then
    echo "volumes:" >> "$OUTPUT_FILE"
    yq eval '.volumes' "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
else
    log_debug "No volumes configuration found"
fi

# ======================== Summary & Sanity Reports ==========================

log_section "Generation Summary"
log_info "Successfully generated Docker Compose file: $OUTPUT_FILE"
log_info "Processed $processed_services services"
log_info "External ports used: $external_counter/$external_count"
log_info "Internal ports used: $internal_counter/$internal_count"

# Quick duplicate scan summary
dup_count=0
for k in "${!USED_HOST_PORTS[@]}"; do :; done  # touch to avoid 'unused' warning
# If you want a list of first 20 assigned ports for quick visual diff:
if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
  log_subsection "First 20 assigned host ports (any type)"
  i=0
  for p in "${!USED_HOST_PORTS[@]}"; do
    log_debug "Host $p -> ${USED_HOST_PORTS[$p]}"
    ((i++))
    [[ $i -ge 20 ]] && break
  done
fi

# File size
if [ -f "$OUTPUT_FILE" ]; then
    file_size=$(wc -l < "$OUTPUT_FILE")
    log_info "Generated file size: $file_size lines"
fi

# Validate generated YAML
if command -v yq &> /dev/null; then
    if yq eval '.' "$OUTPUT_FILE" > /dev/null 2>&1; then
        log_info "Generated file passed YAML syntax validation"
    else
        log_warn "Generated file has YAML syntax issues"
    fi
fi

# Optionally show final file content (only in DEBUG to avoid huge logs)
log_subsection "Generated Compose File Content"
if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
  log_info "Final compose file contents (DEBUG mode):"
  log_info "----------------------------------------"
  while IFS= read -r line; do
      log_info "$line"
  done < "$OUTPUT_FILE"
  log_info "----------------------------------------"
else
  log_info "Set LOG_LEVEL=DEBUG to print the generated compose file contents."
fi

log_timer
log_info "Detailed logs written to: $LOG_FILE"
log_info "Docker Compose file generation completed"
