

# --- Stage 1: Builder ---
FROM node:25-alpine AS builder
WORKDIR /app

# Build args (for build-time env)
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

# Set only minimal env needed for build
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337

# Install build dependencies only once for cache efficiency
# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat vips-dev python3 make g++

# Copy only package manifests for better cache
COPY CMS/package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy app source (after deps for better cache)
COPY CMS/ ./

# Build the app
RUN npm run build && npm cache clean --force

# Remove unnecessary files to reduce image size
RUN rm -rf /app/node_modules/.cache /app/tests /app/test /app/docs /app/.github \
  && find /app -type d -name "__tests__" -exec rm -rf {} + \
  && find /app -type f -name "*.md" -delete \
  && chmod +x docker-entrypoint.sh

# --- Stage 2: Runtime ---
FROM node:25-alpine AS runtime
WORKDIR /app

# Build args (for env propagation)
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

# Set all runtime envs
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

# Install only runtime dependencies
# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat vips wget netcat-openbsd

# Copy built app and node_modules from builder
COPY --from=builder /app .

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=180s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider --timeout=10 http://localhost:1337/api/health || exit 1

EXPOSE 1337
ENTRYPOINT ["./docker-entrypoint.sh"]
