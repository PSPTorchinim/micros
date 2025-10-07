#!/bin/bash

# Script to generate Docker Compose file with GHCR images based on existing compose file
# Usage: ./generate-compose-file.sh "internal_ports" "external_ports" "docker_tag" "repo_owner" "repo_name"

set -euo pipefail

# Advanced logging configuration
LOG_LEVEL="${LOG_LEVEL:-INFO}"
LOG_FILE="${LOG_FILE:-generate-compose-$(date +%Y%m%d_%H%M%S).log}"
ENABLE_FILE_LOGGING="${ENABLE_FILE_LOGGING:-true}"

# Color codes for console output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Logging functions
log_debug() {
    if [[ "$LOG_LEVEL" == "DEBUG" ]]; then
        log_message "DEBUG" "$1" "$CYAN"
    fi
}

log_info() {
    if [[ "$LOG_LEVEL" =~ ^(DEBUG|INFO)$ ]]; then
        log_message "INFO" "$1" "$GREEN"
    fi
}

log_warn() {
    if [[ "$LOG_LEVEL" =~ ^(DEBUG|INFO|WARN)$ ]]; then
        log_message "WARN" "$1" "$YELLOW"
    fi
}

log_error() {
    log_message "ERROR" "$1" "$RED"
}

log_message() {
    local level="$1"
    local message="$2"
    local color="${3:-$NC}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Console output with color
    echo -e "${color}[${timestamp}] [${level}] ${message}${NC}"
    
    # File logging (without color codes)
    if [[ "$ENABLE_FILE_LOGGING" == "true" ]]; then
        echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
    fi
}

log_section() {
    local section_name="$1"
    log_info "==================== ${section_name} ===================="
}

log_subsection() {
    local subsection_name="$1"
    log_info "---------- ${subsection_name} ----------"
}

# Performance timing
start_time=$(date +%s)
log_timer() {
    local current_time=$(date +%s)
    local elapsed=$((current_time - start_time))
    log_info "Total execution time: ${elapsed}s"
}

# Error handling function
handle_error() {
    local line_number="$1"
    log_error "Script failed at line $line_number"
    log_error "Last command exit code: $?"
    log_timer
    exit 1
}

trap 'handle_error $LINENO' ERR

# Input validation and logging
validate_inputs() {
    log_section "Input Validation"
    
    if [[ -z "$INTERNAL_PORTS" ]]; then
        log_error "Internal ports parameter is empty"
        exit 1
    fi
    
    if [[ -z "$EXTERNAL_PORTS" ]]; then
        log_error "External ports parameter is empty"
        exit 1
    fi
    
    if [[ -z "$DOCKER_TAG" ]]; then
        log_error "Docker tag parameter is empty"
        exit 1
    fi
    
    if [[ -z "$REPO_OWNER" ]]; then
        log_error "Repository owner parameter is empty"
        exit 1
    fi
    
    if [[ -z "$REPO_NAME" ]]; then
        log_error "Repository name parameter is empty"
        exit 1
    fi
    
    log_info "Input validation passed"
}

# Check if we have the required number of arguments
if [ $# -ne 5 ]; then
    echo "Usage: $0 \"internal_ports\" \"external_ports\" \"docker_tag\" \"repo_owner\" \"repo_name\""
    echo "Example: $0 \"40000-49999\" \"50008-60000\" \"dev-abc123\" \"owner\" \"repo\""
    exit 1
fi

# Input parameters
INTERNAL_PORTS="$1"
EXTERNAL_PORTS="$2"
DOCKER_TAG="$3"
REPO_OWNER="$4"
REPO_NAME="$5"

# Initialize logging
log_section "Script Initialization"
log_info "Starting Docker Compose file generation"
log_info "Log level: $LOG_LEVEL"
log_info "Log file: $LOG_FILE"
log_info "File logging: $ENABLE_FILE_LOGGING"

# Validate inputs
validate_inputs

# Source compose file
SOURCE_COMPOSE="Docker/dj-panel-composer.yml"

# Check if source file exists
log_subsection "Source File Validation"
if [ ! -f "$SOURCE_COMPOSE" ]; then
    log_error "Source compose file $SOURCE_COMPOSE not found"
    log_error "Current directory: $(pwd)"
    log_error "Available files in Docker/: $(ls -la Docker/ 2>/dev/null || echo 'Directory not found')"
    exit 1
fi
log_info "Source compose file found: $SOURCE_COMPOSE"

# Convert port strings to arrays more efficiently
log_subsection "Port Configuration"

# Use a more memory-efficient approach for large port ranges
# Convert space-separated string to array using read
read -ra INTERNAL_PORT_ARRAY <<< "$INTERNAL_PORTS"
read -ra EXTERNAL_PORT_ARRAY <<< "$EXTERNAL_PORTS"

# Log array sizes without printing all ports (which causes memory issues)
internal_count=${#INTERNAL_PORT_ARRAY[@]}
external_count=${#EXTERNAL_PORT_ARRAY[@]}

log_info "Internal ports available: $internal_count ports"
log_info "External ports available: $external_count ports"

# Show just the first few and last few ports for debugging
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

# Validate port arrays
if [[ $internal_count -eq 0 ]]; then
    log_warn "No internal ports provided"
fi

if [[ $external_count -eq 0 ]]; then
    log_warn "No external ports provided"
fi

# Counters for port assignment
internal_counter=0
external_counter=0

# Fixed port assignment functions
get_next_internal_port() {
    if [ $internal_counter -lt $internal_count ]; then
        local port="${INTERNAL_PORT_ARRAY[$internal_counter]}"
        log_debug "Assigning internal port: $port (index: $internal_counter)"
        ((internal_counter++))
        echo "$port"
    else
        log_warn "No more internal ports available, using fallback: 40000"
        echo "40000"
    fi
}

get_next_external_port() {
    if [ $external_counter -lt $external_count ]; then
        local port="${EXTERNAL_PORT_ARRAY[$external_counter]}"
        log_debug "Assigning external port: $port (index: $external_counter)"
        ((external_counter++))
        echo "$port"
    else
        log_warn "No more external ports available, using fallback: 50000"
        echo "50000"
    fi
}

# Function to determine which port function to use based on service type
get_port_function_for_service() {
    local service_name="$1"
    local dockerfile="$2"
    
    # Infrastructure services use internal ports (except strapi)
    if [[ "$dockerfile" == Docker/infra/* ]]; then
        if [[ "$service_name" == "strapi" ]]; then
            echo "get_next_external_port"
            log_debug "  Service $service_name: Infrastructure service (Strapi) - using external ports"
        else
            echo "get_next_internal_port"
            log_debug "  Service $service_name: Infrastructure service - using internal ports"
        fi
    else
        # All other services (services, frontends, etc.) use external ports
        echo "get_next_external_port"
        log_debug "  Service $service_name: Application service - using external ports"
    fi
}

# Function to convert dockerfile path to GHCR image name
dockerfile_to_image() {
    local dockerfile="$1"
    local service_name="$2"
    local microservice_name="$3"
    
    log_debug "Converting dockerfile to image:"
    log_debug "  Dockerfile: $dockerfile"
    log_debug "  Service: $service_name"
    log_debug "  Microservice: $microservice_name"
    
    # Extract dockerfile directory and base name from the dockerfile path
    local dockerfile_dir=$(dirname "$dockerfile" | sed 's|Docker/||')
    local dockerfile_base=$(basename "$dockerfile" .Dockerfile)
    
    log_debug "  Extracted dir: $dockerfile_dir"
    log_debug "  Extracted base: $dockerfile_base"
    
    local image_name=""
    
    # Build GHCR image name based on dockerfile structure
    if [[ "$dockerfile" == Docker/infra/* ]]; then
        # Infrastructure services: ghcr.io/owner/repo/infra/service:tag
        image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/infra/${dockerfile_base}:${DOCKER_TAG}"
        log_debug "  Type: Infrastructure service"
    elif [[ "$dockerfile" == Docker/services/* ]]; then
        # Microservices: ghcr.io/owner/repo/services/microservice:tag
        if [ -n "$microservice_name" ] && [ "$microservice_name" != "null" ]; then
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/services/${microservice_name}:${DOCKER_TAG}"
            log_debug "  Type: Microservice (using microservice name: $microservice_name)"
        else
            # Fallback to dockerfile base name
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/services/${dockerfile_base}:${DOCKER_TAG}"
            log_debug "  Type: Microservice (using dockerfile base name fallback)"
        fi
    elif [[ "$dockerfile" == Docker/frontends/* ]] || [[ "$dockerfile" == *react.Dockerfile ]]; then
        # Frontend services: ghcr.io/owner/repo/frontends/microfrontend:tag
        local microfrontend_name=$(yq eval ".services.${service_name}.build.args.MICROFRONTEND_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
        if [ -n "$microfrontend_name" ] && [ "$microfrontend_name" != "null" ]; then
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/frontends/${microfrontend_name}:${DOCKER_TAG}"
            log_debug "  Type: Frontend service (using microfrontend name: $microfrontend_name)"
        else
            # Use service name as fallback for frontend
            image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/frontends/${service_name}:${DOCKER_TAG}"
            log_debug "  Type: Frontend service (using service name fallback)"
        fi
    else
        # Unknown dockerfile pattern - use generic structure
        image_name="ghcr.io/${REPO_OWNER}/${REPO_NAME}/${dockerfile_dir}/${dockerfile_base}:${DOCKER_TAG}"
        log_warn "  Type: Unknown pattern, using generic structure"
    fi
    
    log_debug "  Generated image: $image_name"
    echo "$image_name"
}

# Function to convert ports with dynamic assignment
convert_ports() {
    local service_name="$1"
    local get_port_function="$2"  # Function name to call for getting new ports
    
    log_debug "Converting ports for service: $service_name using $get_port_function"
    
    # Check if the service has ports defined in the source
    local has_ports=$(yq eval ".services.${service_name} | has(\"ports\")" "$SOURCE_COMPOSE" 2>/dev/null)
    
    if [[ "$has_ports" == "true" ]]; then
        log_debug "  Found ports configuration for $service_name"
        
        local port_output="    ports:"
        local port_count=0
        
        # Get all port mappings for this service
        local port_mappings=$(yq eval ".services.${service_name}.ports[]" "$SOURCE_COMPOSE" 2>/dev/null)
        
        while IFS= read -r port_mapping; do
            if [ -n "$port_mapping" ] && [ "$port_mapping" != "null" ]; then
                # Extract the container port (after the colon)
                local container_port=$(echo "$port_mapping" | sed 's/.*://' | tr -d '"')
                
                # Get new port using the provided function
                local new_port=$($get_port_function)
                
                port_output="${port_output}\n      - \"${new_port}:${container_port}\""
                
                log_debug "    Port mapping: $new_port:$container_port (original: $port_mapping)"
                ((port_count++))
            fi
        done <<< "$port_mappings"
        
        if [ $port_count -gt 0 ]; then
            echo -e "$port_output"
            log_debug "  Processed $port_count port mappings for $service_name"
        fi
    else
        log_debug "  No ports configuration found for $service_name"
    fi
}

# Generate the new compose file
OUTPUT_FILE="dj-panel-composer-${DOCKER_TAG}.yml"

log_section "Compose File Generation"
log_info "Output file: $OUTPUT_FILE"
log_info "Reading source compose file: $SOURCE_COMPOSE"

# Start with compose file header
echo "name: djpanel" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "services:" >> "$OUTPUT_FILE"

# Get list of services
log_subsection "Service Discovery"
services=$(yq eval '.services | keys | .[]' "$SOURCE_COMPOSE")
service_count=$(echo "$services" | wc -l)
log_info "Found $service_count services to process"

# Process each service
log_subsection "Service Processing"
processed_services=0

while IFS= read -r service; do
    if [[ -z "$service" ]]; then
        continue
    fi
    
    processed_services=$((processed_services + 1))
    log_info "Processing service $processed_services/$service_count: $service"
    
    # Start service definition
    echo "  ${service}:" >> "$OUTPUT_FILE"
    
    # Get dockerfile path and microservice name with error handling
    dockerfile=$(yq eval ".services.${service}.build.dockerfile" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    microservice_name=$(yq eval ".services.${service}.build.args.MICROSERVICE_NAME" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    
    log_debug "  Service details:"
    log_debug "    Dockerfile: $dockerfile"
    log_debug "    Microservice name: $microservice_name"
    
    # Convert to GHCR image
    if [ "$dockerfile" != "null" ] && [ -n "$dockerfile" ]; then
        image=$(dockerfile_to_image "$dockerfile" "$service" "$microservice_name")
        echo "    image: $image" >> "$OUTPUT_FILE"
        log_debug "    Added image: $image"
    else
        log_warn "    No dockerfile found for service $service"
    fi
    
    # Copy restart policy
    restart=$(yq eval ".services.${service}.restart" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    if [ "$restart" != "null" ] && [ -n "$restart" ]; then
        echo "    restart: $restart" >> "$OUTPUT_FILE"
        log_debug "    Added restart policy: $restart"
    fi
    
    # Copy pull policy
    pull_policy=$(yq eval ".services.${service}.pull_policy" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    if [ "$pull_policy" != "null" ] && [ -n "$pull_policy" ]; then
        echo "    pull_policy: $pull_policy" >> "$OUTPUT_FILE"
        log_debug "    Added pull policy: $pull_policy"
    fi
    
    # Determine which port function to use based on service type
    port_function=$(get_port_function_for_service "$service" "$dockerfile")
    
    # Convert ports with dynamic assignment using the appropriate port function
    port_output=$(convert_ports "$service" "$port_function")
    if [ -n "$port_output" ]; then
        echo "$port_output" >> "$OUTPUT_FILE"
    fi
    
    # Copy expose configuration
    expose=$(yq eval ".services.${service}.expose[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [ -n "$expose" ]; then
        echo "    expose:" >> "$OUTPUT_FILE"
        log_debug "    Adding expose configuration"
        while IFS= read -r port; do
            if [ -n "$port" ] && [ "$port" != "null" ]; then
                echo "      - \"$port\"" >> "$OUTPUT_FILE"
                log_debug "      Expose port: $port"
            fi
        done <<< "$expose"
    fi
    
    # Copy depends_on with better error handling
    depends_on=$(yq eval ".services.${service}.depends_on" "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
    if [ "$depends_on" != "null" ] && [ "$depends_on" != "{}" ] && [ -n "$depends_on" ]; then
        echo "    depends_on:" >> "$OUTPUT_FILE"
        yq eval ".services.${service}.depends_on" "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/      /' >> "$OUTPUT_FILE"
        log_debug "    Added depends_on configuration"
    fi
    
    # Copy networks
    networks=$(yq eval ".services.${service}.networks[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [ -n "$networks" ]; then
        echo "    networks:" >> "$OUTPUT_FILE"
        log_debug "    Adding networks configuration"
        while IFS= read -r network; do
            if [ -n "$network" ]; then
                echo "      - $network" >> "$OUTPUT_FILE"
                log_debug "      Network: $network"
            fi
        done <<< "$networks"
    fi
    
    # Copy volumes
    volumes=$(yq eval ".services.${service}.volumes[]?" "$SOURCE_COMPOSE" 2>/dev/null || echo "")
    if [ -n "$volumes" ]; then
        echo "    volumes:" >> "$OUTPUT_FILE"
        log_debug "    Adding volumes configuration"
        while IFS= read -r volume; do
            if [ -n "$volume" ]; then
                echo "      - $volume" >> "$OUTPUT_FILE"
                log_debug "      Volume: $volume"
            fi
        done <<< "$volumes"
    fi
    
    # Add blank line after service
    echo "" >> "$OUTPUT_FILE"
    log_debug "  Completed processing service: $service"
    
done <<< "$services"

# Copy networks section
log_subsection "Adding Networks Configuration"
networks_section=$(yq eval '.networks' "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
if [ "$networks_section" != "null" ] && [ -n "$networks_section" ]; then
    echo "networks:" >> "$OUTPUT_FILE"
    yq eval '.networks' "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    log_debug "Added networks configuration"
else
    log_debug "No networks configuration found"
fi

# Copy volumes section
log_subsection "Adding Volumes Configuration"
volumes_section=$(yq eval '.volumes' "$SOURCE_COMPOSE" 2>/dev/null || echo "null")
if [ "$volumes_section" != "null" ] && [ -n "$volumes_section" ]; then
    echo "volumes:" >> "$OUTPUT_FILE"
    yq eval '.volumes' "$SOURCE_COMPOSE" 2>/dev/null | sed 's/^/  /' >> "$OUTPUT_FILE"
    log_debug "Added volumes configuration"
else
    log_debug "No volumes configuration found"
fi

# Generate summary
log_section "Generation Summary"
log_info "Successfully generated Docker Compose file: $OUTPUT_FILE"
log_info "Processed $processed_services services"
log_info "External ports used: $external_counter/$external_count"
log_info "Internal ports used: $internal_counter/$internal_count"

# Get file size for reporting
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

# Show final compose file content for debugging (only if DEBUG level)
log_subsection "Generated Compose File Content"
log_info "Final compose file contents:"
log_info "----------------------------------------"
while IFS= read -r line; do
    log_info "$line"
done < "$OUTPUT_FILE"
log_info "----------------------------------------"
log_info "End of compose file content"

log_timer
log_info "Detailed logs written to: $LOG_FILE"
log_info "Docker Compose file generation completed successfully"