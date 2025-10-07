#!/bin/bash

# Function to process services in any category
process_services() {
  local category="$1"  # internal, external, backend, or root level
  local use_external_ports="$2"  # true/false
  
  local services_path
  if [[ "$category" == "root" ]]; then
    services_path=".services"
  else
    services_path=".services.${category}"
  fi
  
  # ALWAYS use original compose_file for reading service structure and config  
  local services=$(echo "$compose_file" | yq eval "$services_path | keys | .[]" - 2>/dev/null || echo "")
  
  for service in $services; do
    if [[ -z "$service" ]]; then continue; fi
    
    # Read service config from ORIGINAL compose file
    local service_config=$(echo "$compose_file" | yq eval "${services_path}.\"$service\"" -)
    
    # Check if service has ANY build configuration (build section OR build context)
    local has_build_section=$(echo "$service_config" | yq eval '.build' - 2>/dev/null | grep -v '^null$' | grep -q '\S' && echo "true" || echo "false")
    local has_build_context=$(echo "$service_config" | yq eval '.build.context' - 2>/dev/null | grep -v '^null$' | grep -q '\S' && echo "true" || echo "false")
    
    if [[ "$has_build_section" != "true" && "$has_build_context" != "true" ]]; then
      echo "  Skipping $service (no build config)"
      continue
    fi
    
    echo "Processing $category service: $service"
    
    # Determine dockerfile path
    local dockerfile_path=$(determine_dockerfile_path "$service" "$service_config")
    
    if [[ "$dockerfile_path" == "null" ]]; then
      echo "  Warning: Could not determine dockerfile for $service, skipping"
      continue
    fi
    
    # Get service names from build args or infer them
    local microservice_name=$(echo "$service_config" | yq eval '.build.args.MICROSERVICE_NAME' - 2>/dev/null || echo "null")
    local microfrontend_name=$(echo "$service_config" | yq eval '.build.args.MICROFRONTEND_NAME' - 2>/dev/null || echo "null")
    
    # Infer names if not provided
    if [[ "$microservice_name" == "null" || "$microservice_name" == "" ]]; then
      if [[ "$dockerfile_path" == *"microservice.Dockerfile" ]]; then
        microservice_name=$(infer_microservice_name "$service")
      fi
    fi
    
    if [[ "$microfrontend_name" == "null" || "$microfrontend_name" == "" ]]; then
      if [[ "$dockerfile_path" == *"microfrontend.Dockerfile" ]]; then
        microfrontend_name=$(infer_microfrontend_name "$service")
      fi
    fi
    
    # Generate GHCR image URL
    local ghcr_image=$(get_ghcr_image "$dockerfile_path" "$microservice_name" "$microfrontend_name")
    
    # Replace build with image in the WORKING COPY (new_compose_file)
    if [[ "$category" == "root" ]]; then
      new_compose_file=$(echo "$new_compose_file" | yq eval "del(.services.\"$service\".build)" -)
      new_compose_file=$(echo "$new_compose_file" | yq eval ".services.\"$service\".image = \"$ghcr_image\"" -)
    else
      new_compose_file=$(echo "$new_compose_file" | yq eval "del(${services_path}.\"$service\".build)" -)
      new_compose_file=$(echo "$new_compose_file" | yq eval "${services_path}.\"$service\".image = \"$ghcr_image\"" -)
    fi
    
    echo "  -> $ghcr_image"
    
    # Handle port mappings (only for services that have ports defined)
    if echo "$service_config" | yq eval '.ports' - | grep -q '\-' 2>/dev/null; then
      local port_count=$(echo "$service_config" | yq eval '.ports | length' -)
      
      for ((i=0; i<port_count; i++)); do
        local current_mapping=$(echo "$service_config" | yq eval ".ports[$i]" -)
        local internal_container_port=$(echo "$current_mapping" | cut -d':' -f2)
        
        local new_port
        
        if [[ "$use_external_ports" == "true" ]]; then
          if [ $external_port_index -lt ${#external_ports[@]} ]; then
            new_port="${external_ports[$external_port_index]}"
            external_port_index=$((external_port_index + 1))
          else
            echo "  Warning: Not enough external ports available for service $service port $i"
            break
          fi
        else
          if [ $internal_port_index -lt ${#internal_ports[@]} ]; then
            new_port="${internal_ports[$internal_port_index]}"
            internal_port_index=$((internal_port_index + 1))
          else
            echo "  Warning: Not enough internal ports available for service $service port $i"
            break
          fi
        fi
        
        local new_mapping="${new_port}:${internal_container_port}"
        
        # Update the compose file
        if [[ "$category" == "root" ]]; then
          new_compose_file=$(echo "$new_compose_file" | yq eval ".services.\"$service\".ports[$i] = \"$new_mapping\"" -)
        else
          new_compose_file=$(echo "$new_compose_file" | yq eval "${services_path}.\"$service\".ports[$i] = \"$new_mapping\"" -)
        fi
        
        echo "  Port mapping: $current_mapping -> $new_mapping"
      done
    fi
  done
}