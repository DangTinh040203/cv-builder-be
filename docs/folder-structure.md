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
└── api-gateway/             # API Gateway service
    ├── src/
    │   ├── main.ts          # Entry point
    │   ├── app/             # Root module and controller
    │   │   ├── app.module.ts
    │   │   └── app.controller.ts
    │   ├── common/          # App-specific shared code
    │   │   ├── configs/     # Environment configuration
    │   │   ├── constants/   # App-specific constants
    │   │   ├── middlewares/ # App-specific middlewares
    │   │   ├── types/       # App-specific types
    │   │   ├── utils/       # App-specific utilities
    │   │   ├── interceptors/# App-specific interceptors
    │   │   ├── guards/      # App-specific guards
    │   │   ├── decorators/  # App-specific decorators
    │   │   └── pipes/       # App-specific pipes
    │   └── modules/         # Feature modules
    ├── project.json         # Nx project configuration
    └── tsconfig.json        # TypeScript config
```

### Planned Services (same structure)

> These services are planned but not yet created:

- `user-service/` - User management service
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
├── constants/               # Shared constants and enums
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
import { SomeConstant } from '@shared/constants';
import { SomeMiddleware } from '@shared/middlewares';
import { someUtil } from '@shared/utils';

// App-specific code (within api-gateway only)
import { Env } from '@api-gateway/common/config';
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
