#!/bin/bash
# Clean rebuild script for fixing Swashbuckle version downgrade issues
# Usage: ./rebuild-clean.sh [service-name]
# If no service name provided, rebuilds all services

set -e

COMPOSE_FILE="dj-panel-composer.yml"
SERVICE_NAME="${1:-}"

echo "============================================"
echo "Clean Rebuild Script for Docker Services"
echo "============================================"
echo ""
echo "This script rebuilds Docker images without cache to fix"
echo "TypeLoadException issues after Swashbuckle version downgrade."
echo ""

# Change to Docker directory
cd "$(dirname "$0")/.."

if [ -z "$SERVICE_NAME" ]; then
    echo "Rebuilding ALL services without cache..."
    echo ""
    docker-compose -f "$COMPOSE_FILE" build --no-cache
else
    echo "Rebuilding service: $SERVICE_NAME without cache..."
    echo ""
    docker-compose -f "$COMPOSE_FILE" build --no-cache "$SERVICE_NAME"
fi

echo ""
echo "✅ Rebuild complete!"
echo ""
echo "Next steps:"
echo "1. Start services: docker-compose -f $COMPOSE_FILE up -d"
if [ -n "$SERVICE_NAME" ]; then
    echo "   Or single service: docker-compose -f $COMPOSE_FILE up -d $SERVICE_NAME"
fi
echo "2. Check logs: docker-compose -f $COMPOSE_FILE logs -f"
if [ -n "$SERVICE_NAME" ]; then
    echo "   Or single service: docker-compose -f $COMPOSE_FILE logs -f $SERVICE_NAME"
fi
echo ""
echo "If issues persist, try the nuclear option:"
echo "  docker-compose -f $COMPOSE_FILE down -v"
echo "  docker system prune -af"
echo "  Then run this script again"
