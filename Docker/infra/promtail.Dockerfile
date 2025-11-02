# Promtail Dockerfile for DJ Beat Blaster Platform
# Collects logs from Docker containers and forwards to Loki

FROM grafana/promtail:3.3.2

# Copy Promtail configuration
COPY Docker/init/promtail/promtail-config.yml /etc/promtail/config.yml

# Expose Promtail port
EXPOSE 9080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9080/ready || exit 1

# Run Promtail
ENTRYPOINT ["/usr/bin/promtail"]
CMD ["-config.file=/etc/promtail/config.yml"]
