# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:25-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm i --omit=dev

# Copy built code from builder stage
COPY --from=builder /app/dist ./dist

# Copy docs directory
COPY docs ./docs

# Expose the port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]