FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY ["Frontends/dj-panel/package.json", "./"]
COPY ["Frontends/dj-panel/", "./"]

# Install dependencies
RUN npm ci

# Expose Storybook port
EXPOSE 6006

# Health check to ensure Storybook is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:6006 || exit 1

# Start Storybook
CMD ["npm", "run", "storybook", "--", "--ci", "--host", "0.0.0.0"]
