#!/bin/bash
# Generate Grafana dashboards from templates with environment-specific values
#
# Usage: ./generate-dashboards.sh <project_name> <replica_index> [docker_compose_file]
# Example: ./generate-dashboards.sh ix-dj-panel-development 1 ../../dj-panel-composer.yml
#
# Environment variables can also be used:
#   PROJECT_NAME - The Docker Compose project name (e.g., ix-dj-panel-development)
#   REPLICA_INDEX - The replica index (default: 1)
#   DOCKER_COMPOSE_FILE - Path to docker-compose file (optional, for dynamic exporter discovery)

set -e

# Get parameters from arguments or environment variables
PROJECT_NAME="${1:-${PROJECT_NAME:-ix-dj-panel-development}}"
REPLICA_INDEX="${2:-${REPLICA_INDEX:-1}}"
DOCKER_COMPOSE_FILE="${3:-${DOCKER_COMPOSE_FILE}}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="${SCRIPT_DIR}/dashboards-templates"
OUTPUT_DIR="${SCRIPT_DIR}/dashboards"

echo "Generating Grafana dashboards..."
echo "  Project Name: ${PROJECT_NAME}"
echo "  Replica Index: ${REPLICA_INDEX}"
echo "  Templates Directory: ${TEMPLATES_DIR}"
echo "  Output Directory: ${OUTPUT_DIR}"

# Function to discover exporters from docker-compose file
discover_exporters() {
    local compose_file="$1"
    
    if [ -z "$compose_file" ] || [ ! -f "$compose_file" ]; then
        echo "  Docker Compose file not provided or not found, using defaults"
        return
    fi
    
    echo "  Docker Compose: $compose_file"
    echo "  Discovering database exporters..."
    
    # Check if docker compose is available
    if ! command -v docker &> /dev/null; then
        echo "  Warning: docker not found, using default exporter endpoints"
        return
    fi
    
    # Parse docker-compose file to find exporters
    # Look for services ending with '-exporter'
    local compose_dir=$(dirname "$compose_file")
    cd "$compose_dir"
    
    # Get all services with '-exporter' in their name
    local exporters=$(docker compose -f "$(basename "$compose_file")" config --services 2>/dev/null | grep -E '.*-exporter$' || true)
    
    if [ -n "$exporters" ]; then
        echo "  Found exporters:"
        echo "$exporters" | while read -r exporter; do
            # Get the port for this exporter
            local port=$(docker compose -f "$(basename "$compose_file")" config 2>/dev/null | \
                grep -A 20 "^  $exporter:" | grep -m1 "- \"[0-9]*:[0-9]*\"" | \
                sed 's/.*"\([0-9]*\):.*/\1/' || echo "")
            
            if [ -n "$port" ]; then
                echo "    - $exporter (port: $port)"
                # Export for use in templates
                export "EXPORTER_${exporter//-/_}_PORT=$port"
                export "EXPORTER_${exporter//-/_}_ENABLED=true"
            fi
        done
    else
        echo "  No exporters found in docker-compose file"
    fi
    
    cd - > /dev/null
}

# Discover exporters if docker-compose file provided
if [ -n "$DOCKER_COMPOSE_FILE" ]; then
    discover_exporters "$DOCKER_COMPOSE_FILE"
fi

echo

# Check if templates directory exists
if [ ! -d "${TEMPLATES_DIR}" ]; then
    echo "Error: Templates directory not found: ${TEMPLATES_DIR}"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

# Process each template file
for template_file in "${TEMPLATES_DIR}"/*.template; do
    if [ ! -f "${template_file}" ]; then
        echo "No template files found in ${TEMPLATES_DIR}"
        exit 1
    fi
    
    # Get the output filename (remove .template extension)
    output_file="${OUTPUT_DIR}/$(basename "${template_file}" .template)"
    
    echo "Processing: $(basename "${template_file}") -> $(basename "${output_file}")"
    
    # Replace template variables using sed
    sed -e "s/\${PROJECT_NAME}/${PROJECT_NAME}/g" \
        -e "s/\${REPLICA_INDEX}/${REPLICA_INDEX}/g" \
        "${template_file}" > "${output_file}"
done

echo
echo "Dashboard generation complete!"
echo "Generated $(find "${OUTPUT_DIR}" -name "*.json" -type f | wc -l) dashboard files"
