# 🎯 CV Builder - Backend

> AI-powered CV Builder with Mock Interview capabilities

## Overview

**CV Builder** is a comprehensive platform that provides CV templates for users to create professional resumes. It features:

- 🎨 **CV Templates** - Professional, customizable CV templates
- 🤖 **AI Integration** - AI-powered suggestions and UI modifications based on user requirements
- 🎤 **Mock Interview** - AI-driven mock interviews via voice/video, tailored to user's skills, experience, and competency level

## Tech Stack

| Layer              | Technologies        |
| ------------------ | ------------------- |
| **Frontend**       | Next.js, Turborepo  |
| **Backend**        | NestJS, Nx Monorepo |
| **Database**       | PostgreSQL          |
| **Cache**          | Redis               |
| **Storage**        | MinIO               |
| **Auth**           | Keycloak            |
| **Message Broker** | NATS                |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

### Setup Development Environment

```bash
# Start infrastructure (PostgreSQL, Redis, MinIO, NATS)
pnpm run dev:setup

# Install dependencies
pnpm install

# Run all services
pnpm run serve:all

# Build all services
pnpm run build:all
```

### Available Scripts

#### 🌐 Global Scripts (All Services)

Run these from the **root directory**:

| Script                | Description                      |
| --------------------- | -------------------------------- |
| `pnpm run build`      | Build a specific app             |
| `pnpm run build:all`  | Build all apps                   |
| `pnpm run serve`      | Start a specific app in dev mode |
| `pnpm run serve:all`  | Start all apps in dev mode       |
| `pnpm run lint`       | Run ESLint on entire workspace   |
| `pnpm run lint:fix`   | Run ESLint with auto-fix         |
| `pnpm run dev:setup`  | Start Docker infrastructure      |
| `pnpm run docs:serve` | Serve documentation (port 4000)  |

#### 📦 Service-Specific Scripts

##### API Gateway

No service-specific scripts (uses global scripts only).

##### User Service

Run these from **root directory** with prefix or **cd into `apps/user-service`**:

| Script                           | Description                           |
| -------------------------------- | ------------------------------------- |
| `pnpm run prisma:generate`       | Generate Prisma Client                |
| `pnpm run prisma:migrate`        | Create and apply migration (dev)      |
| `pnpm run prisma:migrate:deploy` | Deploy migrations (production)        |
| `pnpm run prisma:migrate:reset`  | Reset database and reapply migrations |
| `pnpm run prisma:studio`         | Open Prisma Studio GUI                |
| `pnpm run prisma:seed`           | Seed database with initial data       |

**Examples:**

```bash
# From root directory
cd apps/user-service
pnpm run prisma:generate

# Or with NX from root
pnpm nx run user-service:prisma:generate
```

---

## 🔄 Request Flow

### CV Creation Flow

```
Frontend → API Gateway → Resume Service → PostgreSQL
                              ↓
                    NATS (cv.created event)
                              ↓
                    AI Service (analysis)
```

### Mock Interview Flow

```
Frontend ←→ WebSocket ←→ API Gateway / Interview Service
                              ↓
              Resume Service (fetch CV data via TCP)
                              ↓
              AI Service (generate questions/responses)
                              ↓
                    TTS/STT Processing
                              ↓
              Frontend (audio/video stream)
```

---

## 🔧 Development

### Generate New Application

```bash
npx nx g @nx/nest:app <app-name>
```

### Generate New Library

```bash
npx nx g @nx/node:lib <lib-name>
```

### View Project Graph

```bash
npx nx graph
```

### Database Management (Prisma)

Prisma is configured per-service. For **User Service**, use the scripts defined in `apps/user-service/package.json`.

See [Service-Specific Scripts](#-service-specific-scripts) section above for all available Prisma commands.

**Quick Reference:**

```bash
cd apps/user-service

# Generate Prisma Client after schema changes
pnpm run prisma:generate

# Create and apply migration
pnpm run prisma:migrate

# Open Prisma Studio GUI
pnpm run prisma:studio
```

**Note**: Each microservice has its own Prisma configuration located at:

- `apps/<service-name>/src/common/database/prisma.config.ts`
- `apps/<service-name>/src/common/database/prisma/schema/`

---

## 📚 Architecture Decisions

- **NATS** for async tasks (notifications, analytics) that don't require immediate response
- **gRPC/HTTP** for synchronous internal service communication
- **Redis Queue (BullMQ)** for time-consuming AI requests
- **Multi-tenancy**: Using `userId` for data isolation (B2C model). For B2B, consider schema-based tenant separation

---

## 📝 License

MIT
