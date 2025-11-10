FROM postgres:18-alpine

# --- Build-time inputs baked into the image ---
ARG DATABASE_NAME_POSTGRES
ARG DATABASE_USERNAME_POSTGRES
ARG DATABASE_PASSWORD_POSTGRES

# --- Runtime env for the official entrypoint (persisted in the image) ---
ENV POSTGRES_DB=$DATABASE_NAME_POSTGRES
ENV POSTGRES_USER=$DATABASE_USERNAME_POSTGRES
ENV POSTGRES_PASSWORD=$DATABASE_PASSWORD_POSTGRES

ENV PGDATA=/var/lib/postgresql/data

# A more patient healthcheck:
# - give initdb + first start more time (ZFS/slow disk/TrueNAS)
# - use explicit host, user and db; pg_isready doesn't need a password
HEALTHCHECK --interval=10s --timeout=15s --start-period=120s --retries=12 \
  CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h 127.0.0.1 -p 5432 || exit 1

EXPOSE 5432
