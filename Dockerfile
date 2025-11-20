# Multi-stage build for React (Create React App) production
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
# Copy dependency manifests first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies (handle absence of yarn.lock gracefully)
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    --mount=type=cache,target=/root/.cache/yarn \
    sh -c "\
        echo 'Before yarn install:' && \
        ls -lh /usr/local/share/.cache/yarn && \
        ls -lh /root/.cache/yarn && \
        yarn install --frozen-lockfile --prefer-offline && \
        echo 'After yarn install:' && \
        ls -lh /usr/local/share/.cache/yarn && \
        ls -lh /root/.cache/yarn \
    "
# Copy the rest of the source
COPY . .
# Build static assets
RUN yarn build

# Runtime stage using nginx to serve static files
FROM nginx:1.27-alpine AS runtime
# Remove default nginx assets and copy build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config (optional). Uncomment when you add one.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
