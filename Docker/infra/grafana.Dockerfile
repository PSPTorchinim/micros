# Grafana Dockerfile for DJ Beat Blaster Platform
# Provides visualization dashboard for logs and metrics

FROM grafana/grafana:11.4.0

# Set environment variables
# Note: Admin credentials should be configured via environment variables in docker-compose
# or via GitHub secrets in CI/CD pipelines for security
ENV GF_SECURITY_ADMIN_USER=admin
ENV GF_USERS_ALLOW_SIGN_UP=false
ENV GF_ANALYTICS_REPORTING_ENABLED=false
ENV GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource

# Create directories for provisioning
USER root
RUN mkdir -p /etc/grafana/provisioning/datasources && \
    mkdir -p /etc/grafana/provisioning/dashboards && \
    chown -R grafana:grafana /etc/grafana/provisioning

# Copy datasource configuration
COPY Docker/init/grafana/datasources.yml /etc/grafana/provisioning/datasources/
COPY Docker/init/grafana/dashboards.yml /etc/grafana/provisioning/dashboards/

USER grafana

# Expose Grafana port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Run Grafana
CMD ["/run.sh"]
