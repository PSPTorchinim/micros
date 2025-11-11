# Promtail Dockerfile for DJ Beat Blaster Platform
FROM grafana/promtail:3.5


# Install curl for healthcheck (Debian/Ubuntu-based image)
# hadolint ignore=DL3002
USER root
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy Promtail configuration
COPY Docker/init/promtail/promtail-config.yml /etc/promtail/config.yml

EXPOSE 9080

# Robust healthcheck using the readiness endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:9080/ready || exit 1

ENTRYPOINT ["/usr/bin/promtail"]
CMD ["-config.file=/etc/promtail/config.yml"]