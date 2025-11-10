# Promtail Dockerfile for DJ Beat Blaster Platform
FROM grafana/promtail:3.5


# Use Alpine-based image if available, install curl with apk
USER root
RUN apk add --no-cache curl

# Copy Promtail configuration
COPY Docker/init/promtail/promtail-config.yml /etc/promtail/config.yml

EXPOSE 9080

# Robust healthcheck using the readiness endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:9080/ready || exit 1

ENTRYPOINT ["/usr/bin/promtail"]
CMD ["-config.file=/etc/promtail/config.yml"]