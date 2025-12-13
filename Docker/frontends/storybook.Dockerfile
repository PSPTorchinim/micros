# hadolint global ignore=DL3059
# Stage 1: Build Storybook
FROM node:25-alpine AS builder
WORKDIR /app

# Build-time args
ARG MICROFRONTEND_NAME

COPY Frontends/${MICROFRONTEND_NAME}/ ./
RUN npm install
RUN NODE_OPTIONS="--localstorage-file=/tmp/localstorage" npm run build-storybook 
RUN npm cache clean --force

# Stage 2: Runtime image
FROM node:25-alpine AS runner
WORKDIR /app
COPY --from=builder /app/storybook-static ./storybook-static
# hadolint ignore=DL3018
RUN npm install -g serve@14.2.0 && apk add --no-cache wget

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1
CMD ["serve", "-s", "storybook-static", "-l", "3000"]
