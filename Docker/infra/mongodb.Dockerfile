FROM mongo:8

ARG DATABASE_USER_MONGODB
ARG DATABASE_PASSWORD_MONGODB

ENV MONGO_INITDB_ROOT_USERNAME=$DATABASE_USER_MONGODB
ENV MONGO_INITDB_ROOT_PASSWORD=$DATABASE_PASSWORD_MONGODB
ENV MONGO_INITDB_DATABASE=admin


# Create initialization script directory and mount point directories in one layer
RUN mkdir -p /docker-entrypoint-initdb.d \
  && mkdir -p /data/db /data/configdb

# Copy initialization script
COPY Docker/init/mongo-init.js /docker-entrypoint-initdb.d/01-init-user.js

# Set permissions for initialization script
RUN chmod +r /docker-entrypoint-initdb.d/01-init-user.js

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

EXPOSE 27017

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=5 \
  CMD mongosh --username="$MONGO_INITDB_ROOT_USERNAME" --password="$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase=admin --eval "try { db.adminCommand('ping').ok } catch(e) { print('Health check failed: ' + e); quit(1) }" --quiet || exit 1