# hadolint global ignore=DL3059
# Docker/infra/rabbitmq.Dockerfile
# Hadolint best practices: pin version, add label, use one ENV per line, explicit shell, comments
FROM rabbitmq:4-alpine

LABEL maintainer="PSPTorchinim <your-email@example.com>"

ARG RABBITMQ_USER
ARG RABBITMQ_PASSWORD

# Set environment variables combined for efficiency
ENV RABBITMQ_DEFAULT_USER=$RABBITMQ_USER \
    RABBITMQ_DEFAULT_PASS=$RABBITMQ_PASSWORD

# Use root to set up data dir and a tiny runtime fix script
# hadolint ignore=DL3002
USER root

# Use explicit shell for shell form commands (DL4000)
SHELL ["/bin/sh", "-c"]

# Combine RUN commands to reduce layers
# Creates data directory and cookie permission fix script
# Note: Inline script is intentional - keeps image self-contained without external dependencies
# hadolint ignore=SC2016
RUN mkdir -p /var/lib/rabbitmq && \
    printf '#!/bin/sh\nCOOKIE="/var/lib/rabbitmq/.erlang.cookie"\nif [ -f "$COOKIE" ]; then\n  chmod 400 "$COOKIE" || true\nfi\nexec "$@"\n' > /usr/local/bin/fix-cookie && \
    chmod +x /usr/local/bin/fix-cookie

# Use a shell entrypoint to ensure fix-cookie runs before the official entrypoint
ENTRYPOINT ["/bin/sh", "-c", "/usr/local/bin/fix-cookie && exec docker-entrypoint.sh rabbitmq-server"]

EXPOSE 5672 15672

# Optimized healthcheck with longer intervals
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD rabbitmq-diagnostics -q ping
