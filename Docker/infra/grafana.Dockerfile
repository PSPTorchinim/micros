# Grafana Dockerfile for DJ Beat Blaster Platform
# Provides visualization dashboard for logs and metrics

# hadolint global ignore=DL3059
# hadolint global ignore=DL3002
# hadolint global ignore=DL3018

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
ENV GF_PATHS_DATA=/var/lib/grafana
ENV GF_PATHS_LOGS=/var/lib/grafana/logs
ENV GF_PATHS_PLUGINS=/var/lib/grafana/plugins
# PIPELINE_PAT, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME are required at runtime
# for the GitHub contact point defined in
# Docker/init/grafana/alerting/github-contact-point.yml.
# Provide them via docker-compose environment or a secrets manager.
# Never set defaults — they must be explicitly supplied for Production deployments.
ENV PIPELINE_PAT=""
ENV GITHUB_REPO_OWNER=""
ENV GITHUB_REPO_NAME=""

# Install su-exec for safe user switching and ensure proper permissions
USER root
RUN apk add --no-cache su-exec && \
    mkdir -p /etc/grafana/provisioning/datasources && \
    mkdir -p /etc/grafana/provisioning/dashboards && \
    mkdir -p /etc/grafana/provisioning/alerting && \
    mkdir -p /var/lib/grafana && \
    mkdir -p /var/lib/grafana/plugins && \
    mkdir -p /var/lib/grafana/dashboards && \
    chown -R grafana:root /var/lib/grafana && \
    chmod -R 755 /var/lib/grafana

# Copy custom entrypoint script
COPY Docker/init/grafana/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy datasource configuration
COPY Docker/init/grafana/datasources.yml /etc/grafana/provisioning/datasources/
COPY Docker/init/grafana/dashboards.yml /etc/grafana/provisioning/dashboards/

# Copy alerting provisioning (contact points and notification policies)
COPY Docker/init/grafana/alerting/ /etc/grafana/provisioning/alerting/

# Copy dashboard templates and generator script
COPY Docker/init/grafana/dashboards-templates /etc/grafana/provisioning/dashboards-templates/
COPY Docker/init/grafana/generate-dashboards.sh /etc/grafana/provisioning/

# Generate dashboards from templates during build
WORKDIR /etc/grafana/provisioning
RUN chmod +x generate-dashboards.sh && \
    ./generate-dashboards.sh "${PROJECT_NAME}" "${REPLICA_INDEX}" && \
    echo "Generated dashboards for project: ${PROJECT_NAME}, replica: ${REPLICA_INDEX}"

# Keep as root for entrypoint script to fix permissions, then it will switch to grafana user

# Expose Grafana port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Use custom entrypoint that fixes permissions and then runs Grafana
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
