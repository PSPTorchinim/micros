#!/bin/bash
# Generate Grafana dashboards from templates with environment-specific values
#
# Usage: ./generate-dashboards.sh <project_name> <replica_index>
# Example: ./generate-dashboards.sh ix-dj-panel-development 1
#
# Environment variables can also be used:
#   PROJECT_NAME - The Docker Compose project name (e.g., ix-dj-panel-development)
#   REPLICA_INDEX - The replica index (default: 1)

set -e

# Get parameters from arguments or environment variables
PROJECT_NAME="${1:-${PROJECT_NAME:-ix-dj-panel-development}}"
REPLICA_INDEX="${2:-${REPLICA_INDEX:-1}}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="${SCRIPT_DIR}/dashboards-templates"
OUTPUT_DIR="${SCRIPT_DIR}/dashboards"

echo "Generating Grafana dashboards..."
echo "  Project Name: ${PROJECT_NAME}"
echo "  Replica Index: ${REPLICA_INDEX}"
echo "  Templates Directory: ${TEMPLATES_DIR}"
echo "  Output Directory: ${OUTPUT_DIR}"
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
