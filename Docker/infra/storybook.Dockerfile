FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY ["Frontends/dj-panel/package.json", "./"]
COPY ["Frontends/dj-panel/", "./"]

# Install dependencies
RUN npm ci

# Expose Storybook port
EXPOSE 6006

# Start Storybook
CMD ["npm", "run", "storybook", "--", "--ci", "--host", "0.0.0.0"]
