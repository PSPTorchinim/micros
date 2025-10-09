FROM postgres:18

ARG DATABASE_NAME_POSTGRES
ARG DATABASE_USERNAME_POSTGRES
ARG DATABASE_PASSWORD_POSTGRES

ENV POSTGRES_DB=$DATABASE_NAME_POSTGRES
ENV POSTGRES_USER=$DATABASE_USERNAME_POSTGRES
ENV POSTGRES_PASSWORD=$DATABASE_PASSWORD_POSTGRES

# Create initialization script to ensure database exists
RUN echo "#!/bin/bash" > /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "set -e" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "psql -v ON_ERROR_STOP=1 --username \"\$POSTGRES_USER\" --dbname \"\$POSTGRES_DB\" <<-EOSQL" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "    SELECT 'CREATE DATABASE $DATABASE_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DATABASE_NAME')\\gexec" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    echo "EOSQL" >> /docker-entrypoint-initdb.d/01-create-database.sh && \
    chmod +x /docker-entrypoint-initdb.d/01-create-database.sh

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD pg_isready -h localhost -p 5432 -d $DATABASE_NAME -U $DATABASE_USERNAME

EXPOSE 5432