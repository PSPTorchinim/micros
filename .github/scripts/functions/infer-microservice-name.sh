#!/bin/bash

# Function to infer microservice name from service name
infer_microservice_name() {
  local service_name="$1"
  
  # Remove common suffixes
  local base_name=$(echo "$service_name" | sed -E 's/_(be|api|service)$//')
  
  # Convert to API format (lowercase + api suffix)
  echo "${base_name}api"
}