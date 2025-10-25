# Docker/infra/rabbitmq.Dockerfile
FROM rabbitmq:4

ARG RABBITMQ_USER
ARG RABBITMQ_PASSWORD

ENV RABBITMQ_DEFAULT_USER=$RABBITMQ_USER
ENV RABBITMQ_DEFAULT_PASS=$RABBITMQ_PASSWORD

# Use root to set up data dir and a tiny runtime fix script
USER root


# Ensure data dir exists, is owned by rabbitmq, and create the fix-cookie shim in one RUN
RUN mkdir -p /var/lib/rabbitmq \
  && chown -R rabbitmq:rabbitmq /var/lib/rabbitmq \
  && printf '#!/bin/sh\n'\
  'COOKIE="/var/lib/rabbitmq/.erlang.cookie"\n'\
  'if [ -f "$COOKIE" ]; then\n'\
  '  chown rabbitmq:rabbitmq "$COOKIE" || true\n'\
  '  chmod 400 "$COOKIE" || true\n'\
  'fi\n'\
  'exec "$@"\n' > /usr/local/bin/fix-cookie \
  && chmod +x /usr/local/bin/fix-cookie

# Back to the non-root user used by the official image
USER rabbitmq

# Do NOT bake secrets into the image. Provide at runtime:
#   - RABBITMQ_ERLANG_COOKIE
#   - RABBITMQ_DEFAULT_USER
#   - RABBITMQ_DEFAULT_PASS

# Run the fix before the official entrypoint
ENTRYPOINT ["/usr/local/bin/fix-cookie", "docker-entrypoint.sh"]
CMD ["rabbitmq-server"]

EXPOSE 5672 15672

HEALTHCHECK --interval=10s --timeout=15s --retries=10 \
  CMD rabbitmq-diagnostics -q ping
