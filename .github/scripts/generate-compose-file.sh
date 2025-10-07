#!/bin/bash

# Script to generate Docker Compose file with unused ports and GHCR images
# Usage: ./generate-compose-file.sh "internal_ports" "external_ports" "docker_tag" "repo_owner" "repo_name"

set -e

# Parse arguments
internal_ports_str="$1"
external_ports_str="$2"
docker_tag="$3"
repo_owner="$4"
repo_name="$5"

# Convert space-separated strings to arrays
read -ra internal_ports <<< "$internal_ports_str"
read -ra external_ports <<< "$external_ports_str"

# Read the original compose file
compose_file=$(cat Docker/dj-panel-composer.yml)

# Initialize port counters
internal_port_index=0
external_port_index=0

# Create new compose file with updated ports
new_compose_file="$compose_file"

# Source all function files
script_dir="$(dirname "${BASH_SOURCE[0]}")"
source "$script_dir/functions/get-ghcr-image.sh"
source "$script_dir/functions/infer-microservice-name.sh"
source "$script_dir/functions/infer-microfrontend-name.sh"
source "$script_dir/functions/determine-dockerfile-path.sh"
source "$script_dir/functions/process-services.sh"

# Process all service categories dynamically with explicit checks
echo "=== Processing Internal Services ==="
if echo "$compose_file" | yq eval '.services.internal' - | grep -q '\S' 2>/dev/null; then
  process_services "internal" "false"
else
  echo "No internal services found"
fi

echo "=== Processing External Services ==="
if echo "$compose_file" | yq eval '.services.external' - | grep -q '\S' 2>/dev/null; then
  process_services "external" "true"
else
  echo "No external services found"
fi

echo "=== Processing Backend Services ==="
if echo "$compose_file" | yq eval '.services.backend' - | grep -q '\S' 2>/dev/null; then
  process_services "backend" "false"
else
  echo "No backend services found"
fi

# Check if we have nested structure and flatten it
if echo "$new_compose_file" | yq eval '.services | has("internal") or has("external") or has("backend")' - | grep -q true; then
  echo "=== Flattening Services Structure ==="
  # Flatten the structure back to standard Docker Compose format
  flattened_compose=$(echo "$new_compose_file" | yq eval '
    .services = (.services.internal // {}) + (.services.external // {}) + (.services.backend // {}) + (
      .services | 
      to_entries | 
      map(select(.key != "internal" and .key != "external" and .key != "backend")) | 
      from_entries
    ) |
    del(.services.internal) |
    del(.services.external) |
    del(.services.backend)
  ' -)
  new_compose_file="$flattened_compose"
fi

# Generate filename with tag
filename="dj-panel-composer-${docker_tag}.yml"

# Save the new compose file
echo "$new_compose_file" > "$filename"

echo "compose_file=$filename" >> $GITHUB_OUTPUT
echo "Generated compose file: $filename"
echo "=== Final Compose File ==="
cat "$filename"