# Use Node.js LTS version with specific Alpine version
FROM node:18-alpine3.18

# Set working directory
WORKDIR /app

# Build arguments for environment configuration
ARG CMS_DATABASE_CLIENT
ARG CMS_NODE_ENV
ARG CMS_DATABASE_NAME
ARG CMS_DATABASE_HOST
ARG CMS_DATABASE_PORT
ARG CMS_DATABASE_USERNAME
ARG CMS_DATABASE_PASSWORD
ARG CMS_JWT_SECRET
ARG CMS_ADMIN_JWT_SECRET
ARG CMS_APP_KEYS
ARG CMS_API_TOKEN_SALT
ARG CMS_TRANSFER_TOKEN_SALT
ARG CMS_ENCRYPTION_KEY

# Set environment variables
ENV DATABASE_CLIENT=$CMS_DATABASE_CLIENT
ENV NODE_ENV=$CMS_NODE_ENV
ENV DATABASE_NAME=$CMS_DATABASE_NAME
ENV DATABASE_HOST=$CMS_DATABASE_HOST
ENV DATABASE_PORT=$CMS_DATABASE_PORT
ENV DATABASE_USERNAME=$CMS_DATABASE_USERNAME
ENV DATABASE_PASSWORD=$CMS_DATABASE_PASSWORD
ENV JWT_SECRET=$CMS_JWT_SECRET
ENV ADMIN_JWT_SECRET=$CMS_ADMIN_JWT_SECRET
ENV APP_KEYS=$CMS_APP_KEYS
ENV API_TOKEN_SALT=$CMS_API_TOKEN_SALT
ENV TRANSFER_TOKEN_SALT=$CMS_TRANSFER_TOKEN_SALT
ENV ENCRYPTION_KEY=$CMS_ENCRYPTION_KEY

# Install system dependencies required for Strapi
RUN apk add --no-cache --virtual .build-deps \
    python3=~3.11 \
    make=~4.4 \
    g++=~12.2 \
    libc6-compat=~1.2 \
    vips-dev=~8.14 && \
    apk del .build-deps

# Copy package.json and package-lock.json (if available)
COPY CMS/package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY CMS/ ./

# Build the Strapi admin panel
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S strapi && \
    adduser -S strapi -u 1001

# Change ownership of the app directory to strapi user
RUN chown -R strapi:strapi /app

# Switch to non-root user
USER strapi

# Health check
HEALTHCHECK --interval=10s --timeout=15s --retries=10 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:1337/admin || exit 1

# Expose the port Strapi runs on
EXPOSE 1337

# Start Strapi
CMD ["npm", "start"]