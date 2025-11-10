
# Stage 1: Build Storybook
FROM node:25-alpine AS builder
WORKDIR /app
COPY Frontends/dj-panel/package.json ./
COPY Frontends/dj-panel/ ./
RUN npm ci && npm run build-storybook && npm cache clean --force

# Stage 2: Runtime image
FROM node:25-alpine AS runner
WORKDIR /app
COPY --from=builder /app/storybook-static ./storybook-static
RUN npm install -g serve@14.2.0 && apk add --no-cache wget
EXPOSE 6006
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:6006 || exit 1
CMD ["serve", "-s", "storybook-static", "-l", "6006"]
