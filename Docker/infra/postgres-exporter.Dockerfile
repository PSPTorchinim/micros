# PostgreSQL Exporter Dockerfile
# Monitors PostgreSQL metrics for Prometheus

FROM prometheuscommunity/postgres-exporter:latest

# Build arguments for PostgreSQL connection
ARG CMS_DATABASE_USERNAME
ARG CMS_DATABASE_PASSWORD
ARG CMS_DATABASE_NAME
ARG CMS_DATABASE_HOST=strapi_db
ARG CMS_DATABASE_PORT=5432

# Set environment variable for PostgreSQL connection
# Note: Build args are expanded at build time
ENV DATA_SOURCE_NAME="postgresql://${CMS_DATABASE_USERNAME}:${CMS_DATABASE_PASSWORD}@${CMS_DATABASE_HOST}:${CMS_DATABASE_PORT}/${CMS_DATABASE_NAME}?sslmode=disable"

# Expose metrics port
EXPOSE 9187
