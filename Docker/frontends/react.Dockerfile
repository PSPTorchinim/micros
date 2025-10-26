# Stage 1: Build the application
FROM node:20.19.0 AS builder

SHELL ["/bin/bash","-lc"]

# Set working directory
WORKDIR /app

# Add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG MICROFRONTEND_NAME
ARG API_GATEWAY
ARG SECURE_KEY
ARG JWT_TOKEN
ARG CMS_DATABASE_HOST
ARG CMS_DATABASE_PORT

# Set as ENV for runtime and build
ENV REACT_APP_API_GATEWAY=$API_GATEWAY
ENV REACT_APP_API_SECURE_KEY=$SECURE_KEY
ENV REACT_APP_API_JWT_TOKEN=$JWT_TOKEN
ENV REACT_APP_CMS_DATABASE_HOST=$CMS_DATABASE_HOST
ENV REACT_APP_CMS_DATABASE_PORT=$CMS_DATABASE_PORT

COPY ["Frontends/${MICROFRONTEND_NAME}/package.json", "./"]
COPY ["Frontends/${MICROFRONTEND_NAME}/", "./"]

# hadolint ignore=DL3059
RUN npm config set strict-ssl false
# hadolint ignore=DL3016, DL3059
RUN npm install --retry 5 --fetch-retries 5 --fetch-retry-mintimeout 20000
# hadolint ignore=DL3059
RUN npm run build

# Use a lightweight web server for static files
FROM node:20.19.0 AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm install -g serve@14.2.0

ENV NUGET_PACKAGES=/root/.nuget/packages

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]