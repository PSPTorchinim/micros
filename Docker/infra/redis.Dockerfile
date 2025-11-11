FROM redis:8-alpine

ARG REDIS_PASSWORD

ENV REDIS_PASSWORD=$REDIS_PASSWORD

# Create mount point directory for direct bind mounts
RUN mkdir -p /data && chown -R redis:redis /data

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD redis-cli -a "$REDIS_PASSWORD" ping | grep PONG

EXPOSE 6379