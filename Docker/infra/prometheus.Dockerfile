# Prometheus Dockerfile
# Provides metrics aggregation and time-series database for monitoring

FROM prom/prometheus:v2.48.0

# Copy Prometheus configuration
COPY Docker/init/prometheus/prometheus.yml /etc/prometheus/prometheus.yml

# Expose Prometheus port
EXPOSE 9090

# Run Prometheus with default configuration
# Additional configuration flags are passed via docker-compose command
