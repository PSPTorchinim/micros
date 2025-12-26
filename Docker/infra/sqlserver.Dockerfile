FROM mcr.microsoft.com/mssql/server:2022-latest

ARG DATABASE_PASSWORD_SQLSERVER

ENV ACCEPT_EULA=Y \
    MSSQL_SA_PASSWORD=$DATABASE_PASSWORD_SQLSERVER

# Create mount point directory for direct bind mounts
RUN mkdir -p /var/opt/mssql

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

# Optimized healthcheck with longer intervals
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
  CMD /opt/mssql-tools18/bin/sqlcmd -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" -C || exit 1

EXPOSE 1433