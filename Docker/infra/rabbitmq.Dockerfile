# Docker/infra/rabbitmq.Dockerfile
# Hadolint best practices: pin version, add label, use one ENV per line, explicit shell, comments
FROM rabbitmq:4.0.0

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

# Ensure data dir exists, is owned by rabbitmq, and create the fix-cookie shim in one RUN
RUN mkdir -p /var/lib/rabbitmq \
  && chown -R rabbitmq:rabbitmq /var/lib/rabbitmq \
  && printf "#!/bin/sh\nCOOKIE=\"/var/lib/rabbitmq/.erlang.cookie\"\nif [ -f \"$COOKIE\" ]; then\n  chown rabbitmq:rabbitmq \"$COOKIE\" || true\n  chmod 400 \"$COOKIE\" || true\nfi\nexec \"$@\"\n" > /usr/local/bin/fix-cookie \
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
