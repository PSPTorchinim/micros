#!/bin/bash

# MongoDB Troubleshooting Script
# This script helps diagnose MongoDB connection and authentication issues

echo "=== MongoDB Troubleshooting Script ==="
echo "Timestamp: $(date)"
echo ""

# Check if MongoDB container is running
echo "1. Checking MongoDB container status..."
MONGODB_CONTAINER=$(docker ps --filter "name=mongodb" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")
if [ -z "$MONGODB_CONTAINER" ]; then
    echo "❌ No MongoDB container found running"
    echo "Available containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "✅ MongoDB container status:"
    echo "$MONGODB_CONTAINER"
fi
echo ""

# Check MongoDB logs
echo "2. Recent MongoDB logs (last 50 lines)..."
echo "----------------------------------------"
docker logs --tail 50 $(docker ps --filter "name=mongodb" --format "{{.Names}}" | head -1) 2>/dev/null || echo "❌ Could not retrieve MongoDB logs"
echo ""

# Check environment variables
echo "3. Checking environment variables..."
MONGO_CONTAINER_NAME=$(docker ps --filter "name=mongodb" --format "{{.Names}}" | head -1)
if [ ! -z "$MONGO_CONTAINER_NAME" ]; then
    echo "MongoDB container: $MONGO_CONTAINER_NAME"
    docker exec $MONGO_CONTAINER_NAME env | grep MONGO || echo "❌ No MONGO environment variables found"
else
    echo "❌ No MongoDB container found for environment check"
fi
echo ""

# Test MongoDB connection without authentication
echo "4. Testing MongoDB connection (no auth)..."
if [ ! -z "$MONGO_CONTAINER_NAME" ]; then
    docker exec $MONGO_CONTAINER_NAME mongosh --eval "db.adminCommand('ping')" 2>/dev/null && echo "✅ MongoDB is responding to ping" || echo "❌ MongoDB is not responding"
else
    echo "❌ No MongoDB container found for connection test"
fi
echo ""

# Test MongoDB connection with authentication
echo "5. Testing MongoDB connection (with auth)..."
if [ ! -z "$MONGO_CONTAINER_NAME" ]; then
    echo "Attempting to connect with environment credentials..."
    ROOT_USERNAME=$(docker exec $MONGO_CONTAINER_NAME env | grep MONGO_INITDB_ROOT_USERNAME | cut -d'=' -f2)
    ROOT_PASSWORD=$(docker exec $MONGO_CONTAINER_NAME env | grep MONGO_INITDB_ROOT_PASSWORD | cut -d'=' -f2)
    
    if [ ! -z "$ROOT_USERNAME" ] && [ ! -z "$ROOT_PASSWORD" ]; then
        echo "Username: $ROOT_USERNAME"
        docker exec $MONGO_CONTAINER_NAME mongosh --username="$ROOT_USERNAME" --password="$ROOT_PASSWORD" --authenticationDatabase=admin --eval "db.adminCommand('ping')" 2>/dev/null && echo "✅ Authenticated connection successful" || echo "❌ Authenticated connection failed"
    else
        echo "❌ Could not find root credentials in environment variables"
    fi
else
    echo "❌ No MongoDB container found for authenticated connection test"
fi
echo ""

# List databases
echo "6. Listing available databases..."
if [ ! -z "$MONGO_CONTAINER_NAME" ] && [ ! -z "$ROOT_USERNAME" ] && [ ! -z "$ROOT_PASSWORD" ]; then
    docker exec $MONGO_CONTAINER_NAME mongosh --username="$ROOT_USERNAME" --password="$ROOT_PASSWORD" --authenticationDatabase=admin --eval "db.adminCommand('listDatabases')" 2>/dev/null || echo "❌ Could not list databases"
else
    echo "❌ Skipping database listing due to missing container or credentials"
fi
echo ""

# List users
echo "7. Listing users in admin database..."
if [ ! -z "$MONGO_CONTAINER_NAME" ] && [ ! -z "$ROOT_USERNAME" ] && [ ! -z "$ROOT_PASSWORD" ]; then
    docker exec $MONGO_CONTAINER_NAME mongosh --username="$ROOT_USERNAME" --password="$ROOT_PASSWORD" --authenticationDatabase=admin --eval "db.getUsers()" 2>/dev/null || echo "❌ Could not list users"
else
    echo "❌ Skipping user listing due to missing container or credentials"
fi
echo ""

# Check network connectivity
echo "8. Testing network connectivity..."
echo "Checking if MongoDB port 27017 is accessible..."
if command -v nc >/dev/null 2>&1; then
    nc -z localhost 27017 && echo "✅ Port 27017 is accessible" || echo "❌ Port 27017 is not accessible"
else
    echo "⚠️ netcat (nc) not available for port testing"
fi
echo ""

# Docker Compose service health
echo "9. Checking Docker Compose service health..."
if [ -f "docker-compose.yml" ] || [ -f "Docker/dj-panel-composer.yml" ]; then
    COMPOSE_FILE=""
    if [ -f "Docker/dj-panel-composer.yml" ]; then
        COMPOSE_FILE="Docker/dj-panel-composer.yml"
    elif [ -f "docker-compose.yml" ]; then
        COMPOSE_FILE="docker-compose.yml"
    fi
    
    echo "Using compose file: $COMPOSE_FILE"
    docker compose -f "$COMPOSE_FILE" ps mongodb_container 2>/dev/null || echo "❌ Could not check service status"
else
    echo "❌ No docker-compose.yml file found"
fi
echo ""

echo "=== Troubleshooting Complete ==="
echo ""
echo "Common solutions:"
echo "1. If container is not running: docker compose up -d mongodb_container"
echo "2. If authentication fails: Check environment variables in .env file"
echo "3. If initialization script fails: Remove volumes and recreate: docker compose down -v && docker compose up -d"
echo "4. To view initialization logs: docker logs <mongodb_container_name>"
echo "5. To manually recreate user: Connect without auth and run user creation commands"