# Build stage
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove package-lock and install fresh to avoid rollup issues
RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Build with verbose output and error handling
RUN npm run build --verbose || (echo "Build failed, checking for issues..." && ls -la dist/ 2>/dev/null || echo "No dist folder created" && exit 1)

# Production stage (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
