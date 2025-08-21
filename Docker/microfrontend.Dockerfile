# Stage 1: Build the application
FROM node:latest AS builder

SHELL ["/bin/bash","-lc"]

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG MICROFRONTEND_NAME
ARG PORT

COPY ["Frontends/${MICROFRONTEND_NAME}/package.json", "./"]
RUN npm config set strict-ssl false
RUN npm cache clean --force
RUN npm install

# Install app dependencies
COPY ["Frontends/${MICROFRONTEND_NAME}/", "./"]

EXPOSE ${PORT}
# Start server
ENTRYPOINT ["npm", "run", "prod"]