FROM mongo:8

ARG DATABASE_USER_MONGODB
ARG DATABASE_PASSWORD_MONGODB

ENV MONGO_INITDB_ROOT_USERNAME=$DATABASE_USER_MONGODB
ENV MONGO_INITDB_ROOT_PASSWORD=$DATABASE_PASSWORD_MONGODB

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD mongosh --eval "db.adminCommand('ping')" || mongo --eval "db.adminCommand('ping')"

EXPOSE 27017

# Optionally add custom init scripts
# COPY ./init-mongo.js /docker-entrypoint-initdb.d/