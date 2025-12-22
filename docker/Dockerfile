# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm nx build BFF

# Prune dependencies for production
RUN pnpm nx prune BFF

# =============================================================================
# Stage 2: Production
# =============================================================================
FROM node:22-alpine AS production

# Install pnpm for workspace modules
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built application and pruned lockfile
COPY --from=builder /app/dist/apps/BFF ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

USER nestjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "main.js"]
