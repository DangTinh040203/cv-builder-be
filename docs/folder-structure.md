# Folder Structure

This document describes the project's folder structure and the purpose of each directory.

## Root Directory

```
be/
├── apps/                    # Microservices
├── shared/                  # Shared libraries (cross-service)
├── docs/                    # Documentation (this folder)
├── docker/                  # Docker configuration files
├── dist/                    # Build output (git-ignored)
├── node_modules/            # Dependencies (git-ignored)
├── .husky/                  # Git hooks
├── nx.json                  # Nx workspace configuration
├── package.json             # Project dependencies
├── tsconfig.base.json       # Base TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # Project overview
```

## Applications (`apps/`)

Each application is a standalone NestJS microservice with consistent structure.

### Service Structure Template

All services follow this standard structure:

```
<service-name>/
├── src/
│   ├── main.ts              # Entry point
│   ├── bootstrap.ts         # Bootstrap configuration
│   ├── app/                 # Root module
│   │   └── app.module.ts    # Root module definition
│   ├── common/              # App-specific shared code
│   │   ├── configs/         # Environment configuration
│   │   ├── constants/       # App-specific constants
│   │   ├── middlewares/     # App-specific middlewares
│   │   ├── types/           # App-specific types
│   │   ├── utils/           # App-specific utilities
│   │   ├── interceptors/    # App-specific interceptors
│   │   ├── guards/          # App-specific guards
│   │   ├── decorators/      # App-specific decorators
│   │   └── pipes/           # App-specific pipes
│   └── modules/             # Feature modules
│       └── <feature>/       # Feature module folder
│           ├── <feature>.module.ts
│           ├── <feature>.controller.ts
│           └── <feature>.service.ts
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Example environment variables
├── project.json             # Nx project configuration
├── tsconfig.json            # TypeScript config
├── tsconfig.app.json        # TypeScript app config
├── webpack.config.js        # Webpack build configuration
└── eslint.config.mjs        # ESLint config (extends root)
```

### API Gateway (`api-gateway/`)

HTTP API Gateway that routes requests to microservices:

```
apps/api-gateway/
├── src/
│   ├── main.ts              # Entry point (HTTP server)
│   ├── bootstrap.ts         # Gateway bootstrap (HTTP + versioning + CORS)
│   ├── app/
│   │   ├── app.module.ts    # Root module
│   │   └── app.controller.ts
│   ├── common/
│   │   ├── configs/         # env.config.ts (Joi validation)
│   │   ├── constants/       # env.constant.ts (Env enum)
│   │   └── ...
│   └── modules/
│       └── user/            # User feature (TCP client to user-service)
│           ├── user.module.ts
│           └── user.controller.ts
├── .env
└── ...
```

**Key files:**

- `bootstrap.ts` - Uses `bootstrapGateway()` for HTTP server with CORS, versioning
- `user-client.module.ts` - Registers TCP ClientProxy to connect to user-service

### User Service (`user-service/`)

TCP Microservice for user management:

```
apps/user-service/
├── src/
│   ├── main.ts              # Entry point (TCP microservice)
│   ├── bootstrap.ts         # Microservice bootstrap (extends MicroserviceBootstrap)
│   ├── app/
│   │   └── app.module.ts    # Root module
│   ├── common/
│   │   ├── configs/         # env.config.ts
│   │   ├── constants/       # env.constant.ts
│   │   └── ...
│   └── modules/
│       └── user/            # User feature
│           ├── user.module.ts
│           ├── user.controller.ts  # @MessagePattern handlers
│           └── user.service.ts
├── .env
└── ...
```

**Key files:**

- `bootstrap.ts` - Extends `MicroserviceBootstrap` from `@shared/configs`
- `user.controller.ts` - Uses `@MessagePattern({ cmd: 'xxx' })` for TCP handlers

### Planned Services

> These services follow the same structure as user-service:

- `resume-service/` - Resume/CV management service
- `interview-service/` - Mock interview service
- `ai-service/` - AI gateway service
- `storage-service/` - File storage service
- `notification-service/` - Notification service

## Shared Libraries (`shared/`)

Reusable code shared across ALL applications:

```
shared/
├── configs/                 # Bootstrap and app configuration
│   └── src/
│       ├── bootstrap-microservice.config.ts  # Base class for microservices
│       └── index.ts
├── constants/               # Shared constants and enums
│   └── src/
│       ├── service-name.constant.ts  # ServiceName enum
│       └── index.ts
├── types/                   # Shared TypeScript types
├── utils/                   # Utility functions
├── middlewares/             # NestJS middlewares
├── interceptors/            # NestJS interceptors
├── guards/                  # NestJS guards
├── decorators/              # Custom decorators
└── pipes/                   # NestJS pipes
```

### Import Examples

```typescript
// Shared libraries (cross-service)
import { ServiceName } from '@shared/constants/index';
import { MicroserviceBootstrap } from '@shared/configs/bootstrap-microservice.config';
import { someUtil } from '@shared/utils';

// App-specific code (within api-gateway only)
import { Env } from '@api-gateway/common/constants/env.constant';
import { validationSchema } from '@api-gateway/common/configs/env.config';

// App-specific code (within user-service only)
import { UserService } from '@user-service/modules/user/user.service';
```

## Docker Configuration (`docker/`)

```
docker/
├── data/                    # Docker volumes data (git-ignored)
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

## Service Communication

```
┌─────────────────┐      TCP      ┌─────────────────┐
│   API Gateway   │──────────────▶│  User Service   │
│   (HTTP:3000)   │               │   (TCP:3001)    │
└─────────────────┘               └─────────────────┘
        │                                  │
        │                                  │
        ▼                                  ▼
   HTTP Clients               Message Pattern Handlers
   (REST API)                 (@MessagePattern)
```
