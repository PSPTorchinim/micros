FROM bitnami/redis:latest

ARG REDIS_PASSWORD

ENV REDIS_PASSWORD=$REDIS_PASSWORD

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD redis-cli -a "$REDIS_PASSWORD" ping | grep PONG

EXPOSE 6379