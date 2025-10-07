#!/bin/bash

# Function to get GHCR image based on dockerfile and service type
get_ghcr_image() {
  local dockerfile_path="$1"
  local microservice_name="$2"
  local microfrontend_name="$3"
  
  if [[ "$dockerfile_path" == *"infra/"* ]]; then
    # Infrastructure services (infra/mongodb.Dockerfile -> infra/mongodb)
    image_name=$(basename "$dockerfile_path" .Dockerfile)
    echo "ghcr.io/${repo_owner}/${repo_name}/infra/${image_name}:${docker_tag}"
  elif [[ "$dockerfile_path" == *"microservice.Dockerfile" ]]; then
    # Microservices -> services/{microservice_name}
    if [[ "$microservice_name" != "null" && "$microservice_name" != "" ]]; then
      # Convert microservice name to lowercase
      local service_name=$(echo "$microservice_name" | tr '[:upper:]' '[:lower:]')
      echo "ghcr.io/${repo_owner}/${repo_name}/services/${service_name}:${docker_tag}"
    else
      echo "ghcr.io/${repo_owner}/${repo_name}/services/unknown:${docker_tag}"
    fi
  elif [[ "$dockerfile_path" == *"microfrontend.Dockerfile" ]]; then
    # Frontends -> frontends/{microfrontend_name}
    if [[ "$microfrontend_name" != "null" && "$microfrontend_name" != "" ]]; then
      echo "ghcr.io/${repo_owner}/${repo_name}/frontends/${microfrontend_name}:${docker_tag}"
    else
      echo "ghcr.io/${repo_owner}/${repo_name}/frontends/unknown:${docker_tag}"
    fi
  else
    echo "ghcr.io/${repo_owner}/${repo_name}/unknown:${docker_tag}"
  fi
}