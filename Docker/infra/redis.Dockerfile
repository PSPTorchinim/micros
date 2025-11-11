FROM redis:8-alpine

ARG REDIS_PASSWORD

ENV REDIS_PASSWORD=$REDIS_PASSWORD

# Run as root to avoid permission issues with TrueNAS bind mounts
USER root

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD redis-cli -a "$REDIS_PASSWORD" ping | grep PONG

EXPOSE 6379