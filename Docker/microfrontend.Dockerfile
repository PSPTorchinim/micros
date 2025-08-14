# Stage 1: Build the application
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG MICROFRONTEND_NAME
ARG PUBLIC_PATH
ARG PORT

COPY ["Frontends/${MICROFRONTEND_NAME}/package*.json", "./"]
RUN npm config set strict-ssl false
RUN npm cache clean --force
RUN npm install

# Install app dependencies
COPY ["Frontends/${MICROFRONTEND_NAME}/", "./"]

# Build the application
ENV REACT_APP_PUBLIC_PATH=${PUBLIC_PATH}
ENV REACT_APP_PORT=${PORT}

EXPOSE ${PORT}

RUN npm run build
# Start server
ENTRYPOINT ["npm", "run", "build:start"]