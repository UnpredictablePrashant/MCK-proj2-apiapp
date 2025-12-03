FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install production dependencies first to leverage Docker layer caching.
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source.
COPY src ./src

# Default environment can be overridden at runtime.
ENV NODE_ENV=production

CMD ["npm", "start"]
