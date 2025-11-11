FROM grafana/loki:3.5


# Copy only Loki configuration
COPY Docker/init/loki/loki-config.yml /etc/loki/local-config.yaml

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

EXPOSE 3100

# Use wget which is available in the busybox-based image
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3100/ready || exit 1

ENTRYPOINT ["/usr/bin/loki"]
CMD ["-config.file=/etc/loki/local-config.yaml"]
