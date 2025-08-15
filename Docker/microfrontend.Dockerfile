# Stage 1: Build the application
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG MICROFRONTEND_NAME
ARG PUBLIC_PATH
ARG PORT
ARG API_GATEWAY
ARG API_SECURE_KEY
ARG API_JWT_TOKEN

COPY ["Frontends/${MICROFRONTEND_NAME}/package*.json", "./"]
RUN npm config set strict-ssl false
RUN npm cache clean --force
RUN npm install

# Install app dependencies
COPY ["Frontends/${MICROFRONTEND_NAME}/", "./"]

# Build the application
ENV REACT_APP_PUBLIC_PATH=${PUBLIC_PATH}
ENV REACT_APP_PORT=${PORT}
ENV REACT_APP_API_GATEWAY=${API_GATEWAY}
ENV REACT_APP_API_SECURE_KEY=${API_SECURE_KEY}
ENV REACT_APP_API_JWT_TOKEN=${API_JWT_TOKEN}

EXPOSE ${PORT}

RUN npm run build
# Start server
ENTRYPOINT ["npm", "run", "build:start"]