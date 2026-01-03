# hadolint global ignore=DL3059

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

# Install build dependencies in single layer
# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat vips-dev python3 make g++

# Copy package files first for better caching
COPY CMS/package*.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm install --prefer-offline --no-audit --include=dev

# Copy app source (after deps for better cache)
COPY CMS/ ./

# Build the app and clean up in single layer
RUN npm run build && \
	npm cache clean --force && \
	rm -rf /app/node_modules/.cache /app/tests /app/test /app/docs /app/.github && \
	find /app -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null || true && \
	find /app -type f -name "*.md" -delete && \
	chmod +x docker-entrypoint.sh

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

# Install only runtime dependencies in single layer
# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat vips wget netcat-openbsd

# Copy built app and node_modules from builder
COPY --from=builder /app .

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

# Optimized health check - reduced start period for faster deployment
HEALTHCHECK --interval=15s --timeout=10s --start-period=60s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider --timeout=8 http://localhost:1337/api/health || exit 1

EXPOSE 1337
ENTRYPOINT ["./docker-entrypoint.sh"]
