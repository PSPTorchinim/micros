# SQL Server Exporter Dockerfile
# Monitors SQL Server metrics for Prometheus

FROM awaragi/prometheus-mssql-exporter:latest

# Build arguments for SQL Server connection
ARG DATABASE_USER_SQLSERVER
ARG DATABASE_PASSWORD_SQLSERVER
ARG DATABASE_HOST_SQLSERVER=sqlserver
ARG DATABASE_PORT_SQLSERVER=1433

# Set environment variables from build args
ENV SERVER=${DATABASE_HOST_SQLSERVER}
ENV PORT=${DATABASE_PORT_SQLSERVER}
ENV USERNAME=${DATABASE_USER_SQLSERVER}
ENV PASSWORD=${DATABASE_PASSWORD_SQLSERVER}
ENV DEBUG=false

# Expose metrics port
EXPOSE 4000
