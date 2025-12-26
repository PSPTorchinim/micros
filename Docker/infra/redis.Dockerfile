FROM redis:8-alpine

ARG REDIS_PASSWORD

ENV REDIS_PASSWORD=$REDIS_PASSWORD

# Create mount point directory for direct bind mounts in single layer
RUN mkdir -p /data && chown -R redis:redis /data

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

# Optimized healthcheck with longer intervals
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD redis-cli -a "$REDIS_PASSWORD" ping | grep PONG

EXPOSE 6379