
# Stage 1: Build the application
# hadolint global ignore=DL3059
FROM node:22-alpine AS builder
WORKDIR /app

# Build-time args for all environment variables
# WARNING: SECURE_KEY and JWT_TOKEN are stored as GitHub secrets but must be embedded
# in the React bundle at build time. Once embedded, they become visible in browser DevTools
# and network requests. This is an architectural limitation of client-side React apps.
# Consider using these only for API endpoint identification, not for authentication.
ARG MICROFRONTEND_NAME
ARG API_GATEWAY
ARG SECURE_KEY
ARG JWT_TOKEN
ARG CMS_HOST
ARG CMS_PORT
ARG CMS_PROTOCOL
ARG CMS_API_PATH

# Set as ENV for build and runtime
# These values are embedded in the client-side bundle and exposed to browsers
ENV REACT_APP_API_GATEWAY=$API_GATEWAY \
	REACT_APP_API_SECURE_KEY=$SECURE_KEY \
	REACT_APP_API_JWT_TOKEN=$JWT_TOKEN \
	REACT_APP_CMS_HOST=$CMS_HOST \
	REACT_APP_CMS_PORT=$CMS_PORT \
	REACT_APP_CMS_PROTOCOL=$CMS_PROTOCOL \
	REACT_APP_CMS_API_PATH=$CMS_API_PATH \
	NODE_ENV=production

# Copy package files first for better caching
COPY Frontends/${MICROFRONTEND_NAME}/package*.json ./

# Install dependencies - dev dependencies are needed for build process
# Using npm ci for reproducible builds (faster than npm install)
# --prefer-offline uses cached packages when available
# --no-audit skips security audit for faster installs
RUN --mount=type=cache,target=/root/.npm \
	npm ci --prefer-offline --no-audit

# Copy source files
COPY Frontends/${MICROFRONTEND_NAME}/ ./

# Build and clean in single layer
RUN npm run build && \
	npm cache clean --force


# Stage 2: Runtime image
FROM node:22-alpine AS runner
WORKDIR /app

# Accept the same ARGs for runtime (for docker-compose or build-time substitution)
# These values are already embedded in the static bundle from the build stage
ARG API_GATEWAY
ARG SECURE_KEY
ARG JWT_TOKEN
ARG CMS_HOST
ARG CMS_PORT
ARG CMS_PROTOCOL
ARG CMS_API_PATH

# Set as ENV for runtime
# These values are already baked into the static bundle and exposed to browsers
ENV REACT_APP_API_GATEWAY=$API_GATEWAY \
	REACT_APP_API_SECURE_KEY=$SECURE_KEY \
	REACT_APP_API_JWT_TOKEN=$JWT_TOKEN \
	REACT_APP_CMS_HOST=$CMS_HOST \
	REACT_APP_CMS_PORT=$CMS_PORT \
	REACT_APP_CMS_PROTOCOL=$CMS_PROTOCOL \
	REACT_APP_CMS_API_PATH=$CMS_API_PATH \
	NODE_ENV=production

# Install serve and curl in single layer
# hadolint ignore=DL3018
RUN npm install -g serve@14.2.0 && \
	apk add --no-cache curl && \
	npm cache clean --force

# Copy only built assets (not package.json - not needed at runtime)
COPY --from=builder /app/dist ./dist

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

# Optimized health check - increased intervals for less resource usage
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
	CMD curl -f http://localhost:3000 || exit 1

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]