#!/bin/sh
set -e

echo "🚀 Starting Strapi application..."
echo "📅 Timestamp: $(date)"
echo "🌍 Environment: ${NODE_ENV:-development}"
echo "🏠 Host: ${HOST:-0.0.0.0}"
echo "🔌 Port: ${PORT:-1337}"
echo "💾 Database Client: ${DATABASE_CLIENT:-sqlite}"
echo "🗄️ Database Host: ${DATABASE_HOST:-localhost}"

# Wait for database if it's external
if [ "$DATABASE_CLIENT" = "postgres" ] && [ "$DATABASE_HOST" != "localhost" ]; then
    echo "⏳ Waiting for database connection..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if nc -z "$DATABASE_HOST" "${DATABASE_PORT:-5432}"; then
            echo "✅ Database connection established"
            break
        fi
        echo "🔄 Waiting for database... ($timeout seconds remaining)"
        timeout=$((timeout - 1))
        sleep 1
    done
    
    if [ $timeout -eq 0 ]; then
        echo "❌ Database connection timeout"
        exit 1
    fi
fi

echo "🔧 Starting Strapi server..."
exec npm start
