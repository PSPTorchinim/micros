# Loki Dockerfile for DJ Beat Blaster Platform
# Provides log aggregation and storage

FROM grafana/loki:3.3.2

# Copy Loki configuration
COPY Docker/init/loki/loki-config.yml /etc/loki/local-config.yaml

# Expose Loki ports
EXPOSE 3100

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3100/ready || exit 1

# Run Loki
ENTRYPOINT ["/usr/bin/loki"]
CMD ["-config.file=/etc/loki/local-config.yaml"]
