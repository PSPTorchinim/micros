#!/bin/bash

# Strapi Rebuild Helper Script
# This script helps rebuild the Strapi Docker image when API changes are made

set -e

echo "================================================"
echo "DJ Panel - Strapi Rebuild Script"
echo "================================================"
echo ""

# Change to Docker directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DOCKER_DIR"

echo "📦 Current directory: $(pwd)"
echo ""

# Check if docker-compose.yml exists
if [ ! -f "dj-panel-composer.yml" ]; then
    echo "❌ Error: dj-panel-composer.yml not found!"
    echo "   Make sure you're running this script from the Docker directory."
    exit 1
fi

# Parse command line arguments
CLEAN=false
NO_CACHE=false
START=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --no-start)
            START=false
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --clean       Remove volumes before rebuilding (fresh start)"
            echo "  --no-cache    Build without using Docker cache"
            echo "  --no-start    Don't start services after building"
            echo "  --help        Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Standard rebuild"
            echo "  $0 --clean            # Clean rebuild (removes data)"
            echo "  $0 --no-cache         # Rebuild without cache"
            echo "  $0 --clean --no-cache # Complete fresh build"
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "   Use --help for usage information"
            exit 1
            ;;
    esac
done

# Stop Strapi container
echo "🛑 Stopping Strapi container..."
docker-compose -f dj-panel-composer.yml stop strapi

# Clean volumes if requested
if [ "$CLEAN" = true ]; then
    echo "🧹 Removing volumes (this will delete all data)..."
    read -p "   Are you sure? This will delete all Strapi data! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f dj-panel-composer.yml down -v strapi
        echo "   ✅ Volumes removed"
    else
        echo "   ⏭️  Skipping volume removal"
        CLEAN=false
    fi
fi

# Build Strapi image
echo "🔨 Building Strapi image..."
BUILD_CMD="docker-compose -f dj-panel-composer.yml build"
if [ "$NO_CACHE" = true ]; then
    BUILD_CMD="$BUILD_CMD --no-cache"
    echo "   Using --no-cache flag"
fi
BUILD_CMD="$BUILD_CMD strapi"

echo "   Running: $BUILD_CMD"
$BUILD_CMD

if [ $? -eq 0 ]; then
    echo "   ✅ Build completed successfully"
else
    echo "   ❌ Build failed"
    exit 1
fi

# Start services if requested
if [ "$START" = true ]; then
    echo "🚀 Starting services..."
    docker-compose -f dj-panel-composer.yml up -d strapi
    
    echo ""
    echo "⏳ Waiting for Strapi to be ready..."
    echo "   This may take 30-60 seconds on first start..."
    
    # Wait for health check
    TIMEOUT=120
    ELAPSED=0
    while [ $ELAPSED -lt $TIMEOUT ]; do
        if docker-compose -f dj-panel-composer.yml ps strapi | grep -q "healthy"; then
            echo ""
            echo "✅ Strapi is ready!"
            echo ""
            echo "🌐 Access points:"
            echo "   - CMS Admin: http://localhost:1337/admin"
            echo "   - API: http://localhost:1337/api"
            echo "   - Health: http://localhost:1337/api/health"
            echo "   - Swagger: http://localhost:1337/swagger"
            echo ""
            echo "📋 Useful commands:"
            echo "   - View logs: docker-compose -f dj-panel-composer.yml logs -f strapi"
            echo "   - Stop: docker-compose -f dj-panel-composer.yml stop strapi"
            echo "   - Restart: docker-compose -f dj-panel-composer.yml restart strapi"
            exit 0
        fi
        
        if [ $((ELAPSED % 10)) -eq 0 ]; then
            echo "   Still waiting... ($ELAPSED seconds)"
        fi
        
        sleep 2
        ELAPSED=$((ELAPSED + 2))
    done
    
    echo ""
    echo "⚠️  Timeout waiting for Strapi to be ready"
    echo "   Check logs: docker-compose -f dj-panel-composer.yml logs strapi"
    echo "   Check status: docker-compose -f dj-panel-composer.yml ps strapi"
else
    echo ""
    echo "✅ Build complete (services not started)"
    echo ""
    echo "To start Strapi:"
    echo "   docker-compose -f dj-panel-composer.yml up -d strapi"
fi
