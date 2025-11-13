#!/bin/bash
# Grafana Entrypoint Script
# Ensures proper permissions for /var/lib/grafana at runtime

set -e

echo "Starting Grafana with permission fixes..."

# Check if running as root (for permission fixes)
if [ "$(id -u)" = "0" ]; then
    echo "Running as root, fixing permissions..."
    
    # Ensure /var/lib/grafana exists and has proper ownership
    mkdir -p /var/lib/grafana
    mkdir -p /var/lib/grafana/plugins
    mkdir -p /var/lib/grafana/dashboards
    mkdir -p /var/lib/grafana/alerting
    mkdir -p /var/lib/grafana/png
    
    # Change ownership to grafana user (UID 472)
    chown -R 472:0 /var/lib/grafana
    chmod -R 755 /var/lib/grafana
    
    # Ensure plugins directory is writable
    chmod 775 /var/lib/grafana/plugins
    
    echo "Permissions fixed. Switching to grafana user and starting Grafana..."
    
    # Switch to grafana user and exec the original entrypoint
    exec su-exec 472:0 /run.sh "$@"
else
    echo "Already running as non-root user, starting Grafana..."
    exec /run.sh "$@"
fi