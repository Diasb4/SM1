FROM node:22-bookworm

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Clean install dependencies
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Expose port 80
EXPOSE 80

# Serve SPA via Vite preview with zero extra external dependencies
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
