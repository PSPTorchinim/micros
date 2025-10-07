#!/bin/bash

# Function to infer microfrontend name from service name
infer_microfrontend_name() {
  local service_name="$1"
  
  # Remove common suffixes
  local base_name=$(echo "$service_name" | sed -E 's/_(fe|frontend|ui)$//')
  
  # Special cases
  case "$service_name" in
    host_fe) echo "dj-panel" ;;
    admin_fe) echo "admin-panel" ;;
    *) echo "$base_name" ;;
  esac
}