FROM postgres:18

# --- Build-time inputs baked into the image ---
ARG DATABASE_NAME_POSTGRES
ARG DATABASE_USERNAME_POSTGRES
ARG DATABASE_PASSWORD_POSTGRES

# --- Runtime env for the official entrypoint (persisted in the image) ---
ENV POSTGRES_DB=$DATABASE_NAME_POSTGRES \
    POSTGRES_USER=$DATABASE_USERNAME_POSTGRES \
    POSTGRES_PASSWORD=$DATABASE_PASSWORD_POSTGRES \
    PGDATA=/var/lib/postgresql/data

# Optimized healthcheck with reduced frequency
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
  CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h 127.0.0.1 -p 5432 || exit 1

EXPOSE 5432
