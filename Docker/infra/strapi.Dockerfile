# Node.js LTS on Alpine
FROM node:18-alpine3.18

WORKDIR /app


# Build args
ARG CMS_DATABASE_CLIENT
ARG CMS_NODE_ENV
ARG CMS_DATABASE_HOST
ARG CMS_DATABASE_PORT
ARG CMS_JWT_SECRET
ARG CMS_ADMIN_JWT_SECRET
ARG CMS_APP_KEYS
ARG DATABASE_NAME_POSTGRES
ARG DATABASE_USERNAME_POSTGRES
ARG DATABASE_PASSWORD_POSTGRES
ARG CMS_API_TOKEN_SALT
ARG CMS_TRANSFER_TOKEN_SALT
ARG CMS_ENCRYPTION_KEY

# Env
ENV DATABASE_CLIENT=$CMS_DATABASE_CLIENT \
  NODE_ENV=$CMS_NODE_ENV \
  DATABASE_NAME=$DATABASE_NAME_POSTGRES \
  DATABASE_HOST=$CMS_DATABASE_HOST \
  DATABASE_PORT=$CMS_DATABASE_PORT \
  DATABASE_USERNAME=$DATABASE_USERNAME_POSTGRES \
  DATABASE_PASSWORD=$DATABASE_PASSWORD_POSTGRES \
  JWT_SECRET=$CMS_JWT_SECRET \
  ADMIN_JWT_SECRET=$CMS_ADMIN_JWT_SECRET \
  APP_KEYS=$CMS_APP_KEYS \
  API_TOKEN_SALT=$CMS_API_TOKEN_SALT \
  TRANSFER_TOKEN_SALT=$CMS_TRANSFER_TOKEN_SALT \
  ENCRYPTION_KEY=$CMS_ENCRYPTION_KEY \
  HOST=0.0.0.0 \
  PORT=1337

# ---- Install runtime deps that must remain in the final image ----
# Keep libc6-compat and *runtime* libvips, plus tools for health checks and connectivity
RUN apk add --no-cache \
    libc6-compat=~1.2 \
    vips=~8.14 \
    wget=~1.21 \
    netcat-openbsd=~1.219

# ---- Copy manifests first to leverage Docker layer caching ----
COPY CMS/package*.json ./

# ---- Install build deps only for compiling native modules, then remove ----
RUN apk add --no-cache --virtual .build-deps \
      python3=~3.11 make=~4.4 g++=~12.2 vips-dev=~8.14 \
  && npm ci --only=production \
  && apk del .build-deps

# ---- Copy app code ----
COPY CMS/ ./


# ---- Build Strapi admin, make entrypoint executable, and drop privileges in one RUN ----
RUN npm run build \
  && chmod +x docker-entrypoint.sh \
  && addgroup -g 1001 -S strapi \
  && adduser -S strapi -u 1001 \
  && chown -R strapi:strapi /app
USER strapi

# Health check – use custom health endpoint with longer grace period
HEALTHCHECK --interval=30s --timeout=15s --start-period=180s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider --timeout=10 http://localhost:1337/api/health || exit 1

EXPOSE 1337
ENTRYPOINT ["./docker-entrypoint.sh"]
