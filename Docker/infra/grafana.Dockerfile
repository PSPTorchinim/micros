# Grafana Dockerfile for DJ Beat Blaster Platform
# Provides visualization dashboard for logs and metrics


# Use official Grafana image (already minimal), but combine RUN commands for efficiency
FROM grafana/grafana:12.2.1

# Build args for admin credentials configuration
ARG GRAFANA_ADMIN_USER
ARG GRAFANA_ADMIN_PASSWORD

# Build args for dashboard generation
ARG PROJECT_NAME=ix-dj-panel-development
ARG REPLICA_INDEX=1

# Set environment variables
# Note: Admin credentials should be configured via environment variables in docker-compose
# or via GitHub secrets in CI/CD pipelines for security
# WARNING: Default password is for LOCAL DEVELOPMENT ONLY! Always change for production!
ENV GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER:-admin}
ENV GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:-djpanel_grafana_admin_2024}
ENV GF_USERS_ALLOW_SIGN_UP=false
ENV GF_ANALYTICS_REPORTING_ENABLED=false
ENV GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource
ENV GF_SERVER_HTTP_PORT=3001

# Create directories for provisioning

USER root
RUN mkdir -p /etc/grafana/provisioning/datasources /etc/grafana/provisioning/dashboards

# Copy datasource configuration
COPY Docker/init/grafana/datasources.yml /etc/grafana/provisioning/datasources/
COPY Docker/init/grafana/dashboards.yml /etc/grafana/provisioning/dashboards/


# Copy dashboard templates and generator script
COPY Docker/init/grafana/dashboards-templates /etc/grafana/provisioning/dashboards-templates/
COPY Docker/init/grafana/generate-dashboards.sh /etc/grafana/provisioning/

# Generate dashboards from templates during build (single RUN)
RUN cd /etc/grafana/provisioning \
    && chmod +x generate-dashboards.sh \
    && ./generate-dashboards.sh "${PROJECT_NAME}" "${REPLICA_INDEX}" \
    && rm -rf /etc/grafana/provisioning/dashboards-templates \
    && rm -f /etc/grafana/provisioning/generate-dashboards.sh


# Run as root to avoid permission issues with TrueNAS bind mounts
USER root

# Expose Grafana port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Run Grafana
CMD ["/run.sh"]
