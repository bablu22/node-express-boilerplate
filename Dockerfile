# Build stage
FROM node:20.11.1-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20.11.1-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/public ./dist/src/public

COPY .env.example .env

# Change to non-root user
USER appuser

EXPOSE ${PORT:-5000}

# Use absolute path for npm start
CMD ["npm", "start"]
