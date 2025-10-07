#!/bin/bash

# Function to determine dockerfile path based on service characteristics
determine_dockerfile_path() {
  local service_name="$1"
  local service_config="$2"
  
  # Check if dockerfile is explicitly defined
  local dockerfile_path=$(echo "$service_config" | yq eval '.build.dockerfile' - 2>/dev/null || echo "null")
  if [[ "$dockerfile_path" != "null" ]]; then
    echo "$dockerfile_path"
    return
  fi
  
  # Check if there's any build context
  local build_context=$(echo "$service_config" | yq eval '.build.context' - 2>/dev/null || echo "null")
  if [[ "$build_context" != "null" ]]; then
    # Has build context, dynamically check for infra dockerfiles
    
    # Check if any infra dockerfile exists that could match this service
    for infra_file in Docker/infra/*.Dockerfile; do
      if [[ -f "$infra_file" ]]; then
        local infra_name=$(basename "$infra_file" .Dockerfile)
        
        # Simple substring matching - if service name contains infra name or vice versa
        if [[ "$service_name" == *"$infra_name"* ]] || [[ "$infra_name" == *"$service_name"* ]]; then
          echo "$infra_file"
          return
        fi
        
        # Also check with common separators removed
        local clean_service=$(echo "$service_name" | tr '_-' '')
        local clean_infra=$(echo "$infra_name" | tr '_-' '')
        
        if [[ "$clean_service" == *"$clean_infra"* ]] || [[ "$clean_infra" == *"$clean_service"* ]]; then
          echo "$infra_file"
          return
        fi
      fi
    done
    
    # If no infra match found, determine by service type patterns
    case "$service_name" in
      *_be|*_api|*_service|apigateway) echo "Docker/microservice.Dockerfile" ;;
      *_fe|*_frontend|*_ui|host_fe) echo "Docker/microfrontend.Dockerfile" ;;
      *) echo "Docker/microservice.Dockerfile" ;; # Default to microservice
    esac
  else
    echo "null"
  fi
}