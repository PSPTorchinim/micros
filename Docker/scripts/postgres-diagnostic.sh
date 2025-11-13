#!/bin/bash
# PostgreSQL Diagnostic Script for TrueNAS/Docker troubleshooting

echo "=== PostgreSQL Container Diagnostic ==="
echo "Timestamp: $(date)"
echo ""

# Check if container is running
CONTAINER_NAME="${1:-djpanel-strapi_db-1}"
echo "🔍 Checking container: $CONTAINER_NAME"

if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    echo "✅ Container is running"
    
    # Show container logs
    echo ""
    echo "📋 Recent container logs:"
    docker logs --tail 50 "$CONTAINER_NAME"
    
    # Check container processes
    echo ""
    echo "🔧 Container processes:"
    docker exec "$CONTAINER_NAME" ps aux 2>/dev/null || echo "❌ Cannot access container processes"
    
    # Check data directory
    echo ""
    echo "📁 Data directory status:"
    docker exec "$CONTAINER_NAME" ls -la /var/lib/postgresql/data 2>/dev/null || echo "❌ Cannot access data directory"
    
    # Check PGDATA directory
    echo ""
    echo "📁 PGDATA directory status:"
    docker exec "$CONTAINER_NAME" ls -la /var/lib/postgresql/data/pgdata 2>/dev/null || echo "❌ PGDATA directory not found"
    
    # Check PostgreSQL status
    echo ""
    echo "🔌 PostgreSQL connection test:"
    docker exec "$CONTAINER_NAME" pg_isready -U "${CMS_DATABASE_USERNAME:-strapi_user}" -d "${CMS_DATABASE_NAME:-djpanel_strapi_db}" 2>/dev/null || echo "❌ PostgreSQL not ready"
    
    # Check environment variables
    echo ""
    echo "🌍 Environment variables:"
    docker exec "$CONTAINER_NAME" env | grep POSTGRES 2>/dev/null || echo "❌ Cannot access environment"
    
else
    echo "❌ Container is not running"
    
    # Show all containers with postgres/strapi in name
    echo ""
    echo "📋 Related containers:"
    docker ps -a | grep -E "(postgres|strapi)"
    
    # Show recent logs if container exists but stopped
    if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
        echo ""
        echo "📋 Last logs from stopped container:"
        docker logs --tail 30 "$CONTAINER_NAME"
    fi
fi

echo ""
echo "=== Diagnostic Complete ==="