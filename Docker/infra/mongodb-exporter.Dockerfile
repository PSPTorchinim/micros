# MongoDB Exporter Dockerfile
# Monitors MongoDB metrics for Prometheus

FROM percona/mongodb_exporter:0.40

# Build arguments for MongoDB connection
ARG DATABASE_USER_MONGODB
ARG DATABASE_PASSWORD_MONGODB
ARG DATABASE_HOST_MONGODB=mongodb_container
ARG DATABASE_PORT_MONGODB=27017

# Set environment variable for MongoDB URI
# Note: Build args are expanded at build time
ENV MONGODB_URI="mongodb://${DATABASE_USER_MONGODB}:${DATABASE_PASSWORD_MONGODB}@${DATABASE_HOST_MONGODB}:${DATABASE_PORT_MONGODB}"

# Expose metrics port
EXPOSE 9216

# Run with collect-all flag
CMD ["--collect-all"]
