#!/bin/bash

# PostgreSQL Debug Script for TrueNAS
# Usage: ./debug-postgres.sh [app-name]

set -euo pipefail

APP_NAME="${1:-dj-panel-development}"
echo "=========================================="
echo "🐘 PostgreSQL Debug Script"
echo "=========================================="
echo "Debugging app: $APP_NAME"
echo ""

# Find PostgreSQL container
echo "🔍 Finding PostgreSQL container..."
POSTGRES_CONTAINER=$(docker ps -aq --filter "label=com.docker.compose.service=strapi_db" --filter "label=com.docker.compose.project=ix-$APP_NAME" | head -1)

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "❌ PostgreSQL container not found for app: $APP_NAME"
    echo ""
    echo "Available containers for this app:"
    docker ps -a --filter "label=com.docker.compose.project=ix-$APP_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" || echo "No containers found"
    exit 1
fi

echo "✅ Found PostgreSQL container: $POSTGRES_CONTAINER"
echo ""

# Container status
echo "📊 Container Status:"
echo "==================="
STATUS=$(docker inspect --format='{{.State.Status}}' "$POSTGRES_CONTAINER")
echo "Status: $STATUS"

if [ "$STATUS" = "exited" ]; then
    EXIT_CODE=$(docker inspect --format='{{.State.ExitCode}}' "$POSTGRES_CONTAINER")
    STARTED_AT=$(docker inspect --format='{{.State.StartedAt}}' "$POSTGRES_CONTAINER")
    FINISHED_AT=$(docker inspect --format='{{.State.FinishedAt}}' "$POSTGRES_CONTAINER")
    
    echo "Exit Code: $EXIT_CODE"
    echo "Started At: $STARTED_AT"
    echo "Finished At: $FINISHED_AT"
    
    if [ "$EXIT_CODE" != "0" ]; then
        echo ""
        echo "❌ Container exited with error code $EXIT_CODE"
    fi
fi

# Volume mounts
echo ""
echo "📁 Volume Mounts:"
echo "=================="
docker inspect --format='{{range .Mounts}}Source: {{.Source}}{{"\n"}}Destination: {{.Destination}}{{"\n"}}Type: {{.Type}}{{"\n"}}RW: {{.RW}}{{"\n"}}---{{"\n"}}{{end}}' "$POSTGRES_CONTAINER"

# Check data directory permissions on host
echo ""
echo "🔐 Host Directory Permissions:"
echo "=============================="
DATA_MOUNT=$(docker inspect --format='{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Source}}{{end}}{{end}}' "$POSTGRES_CONTAINER")

if [ -n "$DATA_MOUNT" ]; then
    echo "Data directory: $DATA_MOUNT"
    if [ -d "$DATA_MOUNT" ]; then
        ls -la "$DATA_MOUNT/" | head -10
        echo ""
        echo "Directory permissions:"
        stat "$DATA_MOUNT" 2>/dev/null || echo "Could not stat directory"
        
        # Check if there's a pgdata subdirectory
        if [ -d "$DATA_MOUNT/pgdata" ]; then
            echo ""
            echo "pgdata subdirectory permissions:"
            stat "$DATA_MOUNT/pgdata" 2>/dev/null || echo "Could not stat pgdata"
            ls -la "$DATA_MOUNT/pgdata/" 2>/dev/null | head -5 || echo "Could not list pgdata contents"
        fi
    else
        echo "❌ Data directory does not exist: $DATA_MOUNT"
    fi
else
    echo "⚠️  Could not determine data directory mount"
fi

# Container logs
echo ""
echo "📋 Container Logs (last 30 lines):"
echo "==================================="
docker logs --tail 30 "$POSTGRES_CONTAINER" 2>&1

# Environment variables
echo ""
echo "🌍 Environment Variables:"
echo "========================="
docker inspect --format='{{range .Config.Env}}{{.}}{{"\n"}}{{end}}' "$POSTGRES_CONTAINER" | grep -E "POSTGRES|PGDATA" | sort

# Try to exec into container if running
if [ "$STATUS" = "running" ]; then
    echo ""
    echo "🔍 Container Internal Check:"
    echo "============================"
    
    echo "PostgreSQL process:"
    docker exec "$POSTGRES_CONTAINER" ps aux | grep postgres || echo "No PostgreSQL processes found"
    
    echo ""
    echo "Data directory contents:"
    docker exec "$POSTGRES_CONTAINER" ls -la /var/lib/postgresql/data/ 2>/dev/null || echo "Could not list data directory"
    
    echo ""
    echo "PostgreSQL status:"
    docker exec "$POSTGRES_CONTAINER" pg_isready -U "${POSTGRES_USER:-postgres}" 2>/dev/null || echo "PostgreSQL not ready"
fi

echo ""
echo "=========================================="
echo "🏁 Debug Complete"
echo "=========================================="