# hadolint global ignore=DL3059
# Stage 1: Build Storybook
FROM node:25-alpine AS builder
WORKDIR /app

# Build-time args
ARG MICROFRONTEND_NAME

# Copy package files first for better caching
COPY Frontends/${MICROFRONTEND_NAME}/package*.json ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm \
	npm ci --prefer-offline --no-audit --include=dev

# Copy source files
COPY Frontends/${MICROFRONTEND_NAME}/ ./

# Build and clean in single layer
RUN NODE_OPTIONS="--localstorage-file=/tmp/localstorage" npm run build-storybook && \
	npm cache clean --force

# Stage 2: Runtime image
FROM node:25-alpine AS runner
WORKDIR /app

# Install serve and wget in single layer
# hadolint ignore=DL3018
RUN npm install -g serve@14.2.0 && \
	apk add --no-cache wget && \
	npm cache clean --force

# Copy only built storybook
COPY --from=builder /app/storybook-static ./storybook-static

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

EXPOSE 3000

# Optimized health check - port matches EXPOSE and CMD
# Storybook serves on port 3000 by default
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["serve", "-s", "storybook-static", "-l", "3000"]
