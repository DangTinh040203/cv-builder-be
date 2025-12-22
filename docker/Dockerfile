# =============================================================================
# Stage 1: Builder
# Build the application and generate the necessary artifacts
# =============================================================================
FROM node:22-alpine AS builder

# Enable corepack to use pnpm without installing it manually
RUN corepack enable

WORKDIR /app

# Copy configuration files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including devDependencies for building)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the specific application (BFF)
# Ensure "generatePackageJson": true is set in your project.json for this app
RUN pnpm nx build BFF

# =============================================================================
# Stage 2: Dependencies
# Prepare a clean node_modules folder for production
# =============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Enable corepack
RUN corepack enable

# Copy only the generated package.json from the build output
# This ensures we only install dependencies actually used by the BFF app
COPY --from=builder /app/dist/apps/BFF/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# OPTIMIZATION: Use node-prune to remove unnecessary files (markdown, tests, etc.)
# This significantly reduces the size of node_modules (often by 30-40%)
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# =============================================================================
# Stage 3: Runner
# Final lightweight image for production
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Create a non-root user for security best practices
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Copy the built application from the builder stage
# Set ownership directly during copy to avoid using 'chown' (which adds layers)
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/BFF ./

# Copy the optimized node_modules from the deps stage
# Note: We do NOT install pnpm here to keep the image minimal
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application using 'node' directly to handle OS signals correctly
CMD ["node", "main.js"]