FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Expose Storybook port
EXPOSE 6006

# Start Storybook
CMD ["npm", "run", "storybook", "--", "--ci", "--host", "0.0.0.0"]
