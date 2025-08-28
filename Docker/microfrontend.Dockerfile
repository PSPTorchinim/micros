# Stage 1: Build the application
FROM node:20.12.2 AS builder

SHELL ["/bin/bash","-lc"]

# Set working directory
WORKDIR /app

# Add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG MICROFRONTEND_NAME
ARG REACT_APP_API_GATEWAY
ARG REACT_APP_API_SECURE_KEY
ARG REACT_APP_API_JWT_TOKEN

# Set as ENV for runtime and build
ENV REACT_APP_API_GATEWAY=$REACT_APP_API_GATEWAY
ENV REACT_APP_API_SECURE_KEY=$REACT_APP_API_SECURE_KEY
ENV REACT_APP_API_JWT_TOKEN=$REACT_APP_API_JWT_TOKEN

COPY ["Frontends/${MICROFRONTEND_NAME}/package.json", "./"]
COPY ["Frontends/${MICROFRONTEND_NAME}/", "./"]

RUN npm config set strict-ssl false
RUN npm install --retry 5 --fetch-retries 5 --fetch-retry-mintimeout 20000
RUN npm run build

# Use a lightweight web server for static files
FROM node:20.12.2-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm install -g serve@14.2.0

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]