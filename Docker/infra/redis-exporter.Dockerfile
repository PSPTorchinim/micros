# Redis Exporter Dockerfile
# Monitors Redis metrics for Prometheus

FROM oliver006/redis_exporter:latest

# Build arguments for Redis connection
ARG REDIS_PASSWORD
ARG REDIS_HOST=redis
ARG REDIS_PORT=6379

# Set environment variables for Redis connection
# Note: Build args are expanded at build time
ENV REDIS_ADDR="${REDIS_HOST}:${REDIS_PORT}"
ENV REDIS_PASSWORD="${REDIS_PASSWORD}"

# Expose metrics port
EXPOSE 9121
