
# Stage 1: Build the application
# hadolint global ignore=DL3059
FROM node:25-alpine AS builder
WORKDIR /app

# Build-time args for all environment variables
ARG MICROFRONTEND_NAME
ARG API_GATEWAY
ARG SECURE_KEY
ARG JWT_TOKEN
ARG CMS_HOST
ARG CMS_PORT
ARG CMS_PROTOCOL
ARG CMS_API_PATH

# Set as ENV for build and runtime
ENV REACT_APP_API_GATEWAY=$API_GATEWAY \
	REACT_APP_API_SECURE_KEY=$SECURE_KEY \
	REACT_APP_API_JWT_TOKEN=$JWT_TOKEN \
	REACT_APP_CMS_HOST=$CMS_HOST \
	REACT_APP_CMS_PORT=$CMS_PORT \
	REACT_APP_CMS_PROTOCOL=$CMS_PROTOCOL \
	REACT_APP_CMS_API_PATH=$CMS_API_PATH

COPY Frontends/${MICROFRONTEND_NAME}/package.json ./
COPY Frontends/${MICROFRONTEND_NAME}/ ./
RUN npm ci
RUN npm run build
RUN npm cache clean --force


# Stage 2: Runtime image
FROM node:25-alpine AS runner
WORKDIR /app

# Accept the same ARGs for runtime (for docker-compose or build-time substitution)
ARG API_GATEWAY
ARG SECURE_KEY
ARG JWT_TOKEN
ARG CMS_HOST
ARG CMS_PORT
ARG CMS_PROTOCOL
ARG CMS_API_PATH

# Set as ENV for runtime
ENV REACT_APP_API_GATEWAY=$API_GATEWAY \
	REACT_APP_API_SECURE_KEY=$SECURE_KEY \
	REACT_APP_API_JWT_TOKEN=$JWT_TOKEN \
	REACT_APP_CMS_HOST=$CMS_HOST \
	REACT_APP_CMS_PORT=$CMS_PORT \
	REACT_APP_CMS_PROTOCOL=$CMS_PROTOCOL \
	REACT_APP_CMS_API_PATH=$CMS_API_PATH

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install -g serve@14.2.0
# hadolint ignore=DL3018
RUN apk add --no-cache curl

# Run as root to avoid permission issues with TrueNAS bind mounts
# hadolint ignore=DL3002
USER root

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 CMD curl -f http://localhost:3000 || exit 1
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]