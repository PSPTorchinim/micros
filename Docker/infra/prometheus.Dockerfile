# Prometheus Dockerfile
# Provides metrics aggregation and time-series database for monitoring

FROM prom/prometheus:v2.48.0

# Copy Prometheus configuration
COPY Docker/init/prometheus/prometheus.yml /etc/prometheus/prometheus.yml

# Expose Prometheus port
EXPOSE 9090

# Add healthcheck to ensure Prometheus is ready before dependent services start
# Using wget which is available in the Prometheus base image
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:9090/-/ready || exit 1

# Run Prometheus with default configuration
# Additional configuration flags are passed via docker-compose command
