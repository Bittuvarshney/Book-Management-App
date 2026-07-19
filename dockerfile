# Multi-stage Dockerfile for Jenkins CI/CD
# Builds frontend and backend and produces a production image

### Stage 1: build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/front-end
COPY front-end/package*.json ./
RUN npm ci --silent
COPY front-end/ ./
RUN npm run build --if-present

### Stage 2: build backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --silent
COPY backend/ ./
# If backend needs a build step, uncomment the next line
# RUN npm run build

### Stage 3: production runtime
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy backend runtime files
COPY --from=backend-build /app/backend ./

# Copy built frontend into backend's public/static folder
# Adjust destination path if your backend serves static files elsewhere
RUN mkdir -p ./public
COPY --from=frontend-build /app/front-end/dist ./public

EXPOSE 3000
CMD ["node", "server.js"]

# Notes:
# - This Dockerfile expects the repo layout to match your workspace.
# - Jenkins pipeline can build this image with `docker build -t book-app .` and run tests or push to registry.
