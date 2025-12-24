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

| Script               | Description                 |
| -------------------- | --------------------------- |
| `pnpm run build`     | Build a specific app        |
| `pnpm run build:all` | Build all apps              |
| `pnpm run serve`     | Start a specific app        |
| `pnpm run serve:all` | Start all apps              |
| `pnpm run lint`      | Run ESLint                  |
| `pnpm run lint:fix`  | Run ESLint with auto-fix    |
| `pnpm run dev:setup` | Start Docker infrastructure |

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

---

## 📚 Architecture Decisions

- **NATS** for async tasks (notifications, analytics) that don't require immediate response
- **gRPC/HTTP** for synchronous internal service communication
- **Redis Queue (BullMQ)** for time-consuming AI requests
- **Multi-tenancy**: Using `userId` for data isolation (B2C model). For B2B, consider schema-based tenant separation

---

## 📝 License

MIT
