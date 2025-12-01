#!/bin/bash
# Fix Grafana permissions on Docker volume
# Run this script if you continue having permission issues

echo "Fixing Grafana volume permissions..."

# Get the Docker volume path
VOLUME_PATH=$(docker volume inspect dj-panel-composer_grafana_data | jq -r '.[0].Mountpoint' 2>/dev/null)

if [ "$VOLUME_PATH" = "null" ] || [ -z "$VOLUME_PATH" ]; then
    echo "Could not find grafana_data volume. Creating it..."
    docker volume create dj-panel-composer_grafana_data
    VOLUME_PATH=$(docker volume inspect dj-panel-composer_grafana_data | jq -r '.[0].Mountpoint')
fi

echo "Volume path: $VOLUME_PATH"

# Check if we have access to the volume path
if [ -d "$VOLUME_PATH" ]; then
    echo "Fixing permissions on $VOLUME_PATH"
    sudo chown -R 472:472 "$VOLUME_PATH"
    sudo chmod -R 755 "$VOLUME_PATH"
    echo "Permissions fixed!"
else
    echo "Cannot access volume path directly. Using Docker container to fix permissions..."
    
    # Use a temporary container to fix permissions
    docker run --rm -v dj-panel-composer_grafana_data:/var/lib/grafana alpine:latest sh -c "
        apk add --no-cache shadow
        addgroup -g 472 grafana
        adduser -D -u 472 -G grafana grafana
        chown -R grafana:grafana /var/lib/grafana
        chmod -R 755 /var/lib/grafana
        mkdir -p /var/lib/grafana/plugins
        chmod 775 /var/lib/grafana/plugins
        ls -la /var/lib/grafana
    "
    echo "Permissions fixed using Docker container!"
fi

echo "You can now restart your Grafana container."