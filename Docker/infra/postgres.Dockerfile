FROM postgres:18

ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD

ENV POSTGRES_DB=$DATABASE_NAME
ENV POSTGRES_USER=$DATABASE_USERNAME
ENV POSTGRES_PASSWORD=$DATABASE_PASSWORD

# Create initialization script to ensure database exists
RUN echo "#!/bin/bash" > /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "set -e" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "psql -v ON_ERROR_STOP=1 --username \"\$POSTGRES_USER\" --dbname \"\$POSTGRES_DB\" <<-EOSQL" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "    SELECT 'CREATE DATABASE $DATABASE_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DATABASE_NAME')\\gexec" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "EOSQL" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    chmod +x /docker-entrypoint-initdb.d/01-create-database.sh

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD pg_isready -h localhost -p 5432 -d $DATABASE_NAME -U $DATABASE_USERNAME

EXPOSE 5432