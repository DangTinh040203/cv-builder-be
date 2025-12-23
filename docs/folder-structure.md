# Folder Structure

This document describes the project's folder structure and the purpose of each directory.

## Root Directory

```
be/
├── apps/                    # Application modules
├── libs/                    # Shared libraries
├── docs/                    # Documentation (this folder)
├── docker/                  # Docker configuration files
├── dist/                    # Build output (git-ignored)
├── node_modules/            # Dependencies (git-ignored)
├── .husky/                  # Git hooks
├── .vscode/                 # VS Code settings
├── nx.json                  # Nx workspace configuration
├── package.json             # Project dependencies
├── tsconfig.base.json       # Base TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # Project overview
```

## Applications (`apps/`)

Each application is a standalone NestJS microservice:

```
apps/
├── api-gateway/             # API Gateway service
│   ├── src/
│   │   ├── app/             # Application modules
│   │   ├── main.ts          # Entry point
│   │   └── ...
│   ├── project.json         # Nx project configuration
│   └── tsconfig.json        # TypeScript config
│
├── user-service/            # User management service
├── resume-service/          # Resume/CV management service
├── interview-service/       # Mock interview service
├── ai-service/              # AI gateway service
├── storage-service/         # File storage service
└── notification-service/    # Notification service
```

### Service Responsibilities

| Service                  | Responsibilities                                            |
| ------------------------ | ----------------------------------------------------------- |
| **api-gateway**          | Entry point, auth, routing, data aggregation, rate limiting |
| **user-service**         | User profiles, Keycloak sync, portfolio management          |
| **resume-service**       | CV CRUD, templates, PDF export, version history             |
| **interview-service**    | Session management, Q&A logs, scoring, WebRTC               |
| **ai-service**           | LLM wrapper, prompt management, async processing            |
| **storage-service**      | MinIO wrapper, file upload/download, presigned URLs         |
| **notification-service** | Email notifications, realtime events via NATS               |

## Shared Libraries (`libs/`)

Reusable code shared across all applications:

```
libs/
├── configs/                 # Shared configuration utilities
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   └── project.json
│
├── constants/               # Shared constants and enums
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   └── project.json
│
├── interceptors/            # NestJS interceptors
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   └── project.json
│
├── middlewares/             # NestJS middlewares
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   └── project.json
│
├── types/                   # Shared TypeScript types
│   └── ...
│
└── utils/                   # Utility functions
    ├── src/
    │   ├── index.ts
    │   └── ...
    └── project.json
```

### Library Usage

Import shared libraries in your application code:

```typescript
import { SomeConstant } from '@libs/constants';
import { SomeMiddleware } from '@libs/middlewares';
import { someUtil } from '@libs/utils';
```

## Docker Configuration (`docker/`)

```
docker/
├── docker-compose.dev.yml   # Development environment services
├── docker-compose.prod.yml  # Production environment services
└── Dockerfile               # Application Dockerfile
```

## Configuration Files

| File                  | Purpose                           |
| --------------------- | --------------------------------- |
| `nx.json`             | Nx workspace settings and targets |
| `tsconfig.base.json`  | Base TypeScript compiler options  |
| `eslint.config.mjs`   | ESLint rules and plugins          |
| `.prettierrc`         | Code formatting rules             |
| `.env.example`        | Example environment variables     |
| `pnpm-workspace.yaml` | pnpm workspace configuration      |
