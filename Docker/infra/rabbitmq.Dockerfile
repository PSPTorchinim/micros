# Docker/infra/rabbitmq.Dockerfile
# Hadolint best practices: pin version, add label, use one ENV per line, explicit shell, comments
FROM rabbitmq:4-alpine

LABEL maintainer="PSPTorchinim <your-email@example.com>"

ARG RABBITMQ_USER
ARG RABBITMQ_PASSWORD

# Set environment variables one per line (DL4006)
ENV RABBITMQ_DEFAULT_USER=$RABBITMQ_USER
ENV RABBITMQ_DEFAULT_PASS=$RABBITMQ_PASSWORD

# Use root to set up data dir and a tiny runtime fix script
USER root

# Use explicit shell for shell form commands (DL4000)
SHELL ["/bin/sh", "-c"]

# Ensure data dir exists and is owned by rabbitmq
RUN mkdir -p /var/lib/rabbitmq \
  && chown -R rabbitmq:rabbitmq /var/lib/rabbitmq

# Create a wrapper entrypoint script to fix cookie permissions
# hadolint ignore=SC2016
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
# Fix Erlang cookie permissions if it exists\n\
COOKIE="/var/lib/rabbitmq/.erlang.cookie"\n\
if [ -f "$COOKIE" ]; then\n\
  chmod 600 "$COOKIE" 2>/dev/null || true\n\
fi\n\
\n\
# Execute the original entrypoint with all arguments\n\
exec docker-entrypoint.sh "$@"\n' > /usr/local/bin/rabbitmq-wrapper.sh \
  && chmod +x /usr/local/bin/rabbitmq-wrapper.sh

# Back to the non-root user used by the official image
USER rabbitmq

# Do NOT bake secrets into the image. Provide at runtime:
#   - RABBITMQ_ERLANG_COOKIE
#   - RABBITMQ_DEFAULT_USER
#   - RABBITMQ_DEFAULT_PASS


# Use the wrapper entrypoint
ENTRYPOINT ["/usr/local/bin/rabbitmq-wrapper.sh"]
CMD ["rabbitmq-server"]

EXPOSE 5672 15672

HEALTHCHECK --interval=10s --timeout=15s --retries=10 \
  CMD rabbitmq-diagnostics -q ping
