# CV Builder API (NestJS)

Backend service for a CV/Resume builder platform. Provides authentication, user management, file uploads, email OTP verification, and integrations with MongoDB, Redis, RabbitMQ, and AWS S3.

## Start Guide

### 1) Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- AWS credentials (for S3 uploads), SMTP credentials (for emails)

### 2) Install dependencies

```bash
pnpm install
```

### 3) Environment variables

Copy and fill your environment:

```bash
cp .env.sample .env
```

Key variables:

- NODE_ENV: development | production | test
- PORT: API port (e.g., 3000)
- MONGO_CONNECTION_STRING: e.g. mongodb://cv_builder_user:admin@localhost:27017/cv_builder?authSource=admin
- REDIS_CONNECTION_STRING: e.g. redis://localhost:6379
- EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD: SMTP settings
- JWT_SECRET, JWT_EXPIRES_IN: access token secret and TTL (e.g. 15m)
- JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN: refresh token secret and TTL (e.g. 7d)
- AWS_ACCESS_KEY, AWS_SECRET_KEY: AWS credentials for S3
- CLOUDFRONT_URL: optional CDN base URL
- DEFAULT_USER_AVATAR: default avatar URL

### 4) Start infrastructure (MongoDB, Redis, RabbitMQ)

```bash
docker compose up -d
```

- MongoDB: localhost:27017 (cv_builder_user/admin)
- Redis: localhost:6379
- RabbitMQ UI: http://localhost:15672 (admin/admin)

### 5) Run the server

```bash
# development (watch)
pnpm run start:dev

# development (single run)
pnpm run start

# production
pnpm run build
pnpm run start:prod
```

- Base URL: http://localhost:PORT
- API prefix: /api
- Versioned routes: /api/v1/...

### 6) Quality and tests

```bash
# lint and auto-fix
pnpm run lint

# format
pnpm run format

# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# coverage
pnpm run test:cov
```

## Tech Stack

- Language: TypeScript
- Framework: NestJS 11 (@nestjs/common, core, config, event-emitter, microservices, platform-express)
- Runtime HTTP:
  - Global prefix: /api
  - URI versioning: v1
  - Validation: class-validator + class-transformer (whitelist, transform)
  - Filters/Middleware: global HttpExceptionFilter, CORS, Helmet, Morgan, cookie-parser
- Auth: JWT (access/refresh) with @nestjs/jwt, passport-jwt, guards/strategies and cookie parsing
- Database: MongoDB 6 with mongoose
- Cache/Storage:
  - Redis (cache-manager, keyv with @keyv/redis)
  - AWS S3 (@aws-sdk/client-s3, presigner)
  - Optional CloudFront distribution URL
- Messaging/Jobs:
  - RabbitMQ (dockerized, Nest microservices ready)
  - BullMQ (Redis-backed job queues)
- Email: @nestjs-modules/mailer with Handlebars templates (OTP)
- Tooling: ESLint 9, Prettier 3, Jest 30, ts-jest, ts-node, tsconfig-paths
- Security: Helmet, CORS, Joi-based config validation
- Logging: Nest ConsoleLogger (json enabled), Morgan\\

## Health Check

- Endpoint: `GET /api/v1/health`
- Status: `200 OK`
- Payload:

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

- Example:

```bash
curl -s http://localhost:$PORT/api/v1/health
```

## API Conventions

- Global prefix: `/api`, Version: `v1` → e.g., `/api/v1/...`
- Requests/Responses: JSON
- Validation: DTOs with class-validator, transformation enabled

## Scripts

- build: nest build
- start: nest start
- start:dev: nest start --watch
- start:prod: node dist/main
- lint: eslint "{src,apps,libs,test}/\*_/_.ts" --fix
- format: prettier write src, test, libs
- test: jest (plus test:e2e, test:cov)

## Docker Services

Defined in `docker-compose.yml`:

- mongodb:6.0 with healthcheck and volume
- redis:7-alpine with healthcheck and volume
- rabbitmq:3-management with UI on 15672

License: UNLICENSED
