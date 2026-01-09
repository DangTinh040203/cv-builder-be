#!/bin/bash

# Start Docker containers
echo "Starting Docker containers..."
docker compose -f docker/docker-compose.dev.yml up -d

# Run Prisma Generate for User Service
if [ -d "apps/user-service" ]; then
  echo "Running Prisma Generate for User Service..."
  cd apps/user-service
  pnpm prisma:generate
  cd ../..
else
  echo "Warning: apps/user-service directory not found."
fi

echo "Development setup complete."
