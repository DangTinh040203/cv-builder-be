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

Each application follows **Modular Clean Architecture** (Vertical Slicing) where each feature module contains its complete stack.

### Modular Clean Architecture Structure

```
<service-name>/
├── src/
│   ├── main.ts              # Entry point
│   ├── bootstrap.ts         # Bootstrap configuration
│   ├── app/                 # Root module
│   │   └── app.module.ts
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
│   └── modules/             # Feature modules (Vertical Slicing)
│       └── <feature>/
│           ├── domain/              # Core (pure logic, no framework)
│           │   ├── entities/        # Domain entities
│           │   └── ports/           # Interfaces (Repository, Services)
│           ├── application/         # Use Cases / Services
│           │   └── use-cases/       # Business logic implementation
│           ├── infrastructure/      # Implementation (DB, adapters)
│           │   ├── adapters/        # Repository implementations
│           │   └── database/        # Prisma, migrations
│           ├── presentation/        # API Layer
│           │   └── controllers/     # HTTP/TCP controllers
│           └── <feature>.module.ts  # Feature module (wiring)
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Example environment variables
├── project.json             # Nx project configuration
├── tsconfig.json            # TypeScript config
├── tsconfig.app.json        # TypeScript app config
├── webpack.config.js        # Webpack build configuration
└── eslint.config.mjs        # ESLint config (extends root)
```

### Dependency Flow

```
┌─────────────────┐
│  Presentation   │  ← Controllers (knows Application)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Application   │  ← Use Cases/Services (knows Domain)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Domain      │  ← Entities, Ports (pure, no dependencies)
└────────┬────────┘
         ▲
         │
┌─────────────────┐
│ Infrastructure  │  ← Adapters implement Domain Ports
└─────────────────┘
```

### API Gateway (`api-gateway/`)

HTTP API Gateway that routes requests to microservices:

```
apps/api-gateway/
├── src/
│   ├── main.ts
│   ├── bootstrap.ts
│   ├── app/
│   │   └── app.module.ts
│   ├── common/
│   │   ├── configs/
│   │   └── constants/
│   └── modules/
│       ├── user/
│       │   ├── presentation/controllers/user.controller.ts
│       │   └── user.module.ts
│       └── webhooks/
│           ├── presentation/controllers/webhook.controller.ts
│           └── webhook.module.ts
└── ...
```

### User Service (`user-service/`)

TCP Microservice for user management:

```
apps/user-service/
├── src/
│   ├── main.ts
│   ├── bootstrap.ts
│   ├── app/
│   │   └── app.module.ts
│   ├── common/
│   │   ├── configs/
│   │   └── constants/
│   └── modules/
│       └── user/
│           ├── domain/
│           │   ├── entities/user.entity.ts
│           │   └── ports/user.repository.ts
│           ├── application/
│           │   └── use-cases/user.service.ts
│           ├── infrastructure/
│           │   ├── adapters/
│           │   │   ├── prisma-adapter-user.repo.ts
│           │   │   └── user-repository.module.ts
│           │   └── database/
│           │       ├── database.module.ts
│           │       └── prisma/
│           ├── presentation/
│           │   └── controllers/user.controller.ts
│           └── user.module.ts
└── ...
```

### Import Examples

```typescript
// Shared libraries (cross-service)
import { ServiceName } from '@shared/constants/index';
import { MicroserviceBootstrap } from '@shared/configs/bootstrap-microservice.config';

// App-specific code (within api-gateway only)
import { Env } from '@api-gateway/common/constants/env.constant';
import { validationSchema } from '@api-gateway/common/configs/env.config';

// Feature module imports (within user-service)
import { UserService } from '@user-service/modules/user/application/use-cases/user.service';
import { User } from '@user-service/modules/user/domain/entities/user.entity';
import { IUserRepository } from '@user-service/modules/user/domain/ports/user.repository';
```

## Shared Libraries (`shared/`)

Reusable code shared across ALL applications:

```
shared/
├── configs/                 # Bootstrap and app configuration
│   └── src/
│       ├── bootstrap-microservice.config.ts
│       └── index.ts
├── constants/               # Shared constants and enums
│   └── src/
│       ├── service-name.constant.ts
│       └── index.ts
├── contracts/               # DTOs and patterns for inter-service communication
├── types/                   # Shared TypeScript types
├── utils/                   # Utility functions
├── middlewares/             # NestJS middlewares
├── interceptors/            # NestJS interceptors
├── guards/                  # NestJS guards
├── decorators/              # Custom decorators
└── pipes/                   # NestJS pipes
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

---

## How to Use This Structure

### 1. Layer Responsibilities

| Layer              | What Goes Here                               | Can Import From           |
| ------------------ | -------------------------------------------- | ------------------------- |
| **Domain**         | Entities, Interfaces (Ports), Business Rules | Nothing (pure TypeScript) |
| **Application**    | Use Cases, Services                          | Domain only               |
| **Infrastructure** | Repository implementations, DB adapters      | Domain, external libs     |
| **Presentation**   | Controllers, DTOs                            | Application, Domain       |

### 3. Step-by-Step: Adding a New Feature

#### Step 1: Define the Entity (Domain)

```typescript
// modules/resume/domain/entities/resume.entity.ts
export interface Resume {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
}
```

#### Step 2: Define the Port/Interface (Domain)

```typescript
// modules/resume/domain/ports/resume.repository.ts
import { type Resume } from '../entities/resume.entity';

export const RESUME_REPOSITORY_TOKEN = 'RESUME_REPOSITORY_TOKEN';

export interface IResumeRepository {
  create(resume: Partial<Resume>): Promise<Resume>;
  findById(id: string): Promise<Resume>;
  findByUserId(userId: string): Promise<Resume[]>;
}
```

#### Step 3: Create the Use Case/Service (Application)

```typescript
// modules/resume/application/use-cases/resume.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IResumeRepository,
  RESUME_REPOSITORY_TOKEN,
} from '../../domain/ports/resume.repository';

@Injectable()
export class ResumeService {
  constructor(
    @Inject(RESUME_REPOSITORY_TOKEN)
    private readonly resumeRepo: IResumeRepository,
  ) {}

  async createResume(data: CreateResumeDto) {
    return this.resumeRepo.create(data);
  }
}
```

#### Step 4: Implement the Adapter (Infrastructure)

> ⚠️ **IMPORTANT**: Always map Prisma models to Domain entities using a `toDomain()` method. Never return Prisma objects directly!

```typescript
// modules/resume/infrastructure/adapters/prisma-resume.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { type Resume } from '../../domain/entities/resume.entity';
import { type IResumeRepository } from '../../domain/ports/resume.repository';
import { type Resume as PrismaResume } from '@prisma/client';

@Injectable()
export class PrismaResumeRepository implements IResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps Prisma model to Domain entity.
   * This keeps business logic decoupled from database implementation.
   */
  private toDomain(model: PrismaResume): Resume {
    return {
      id: model.id,
      userId: model.userId,
      title: model.title,
      content: model.content,
      createdAt: model.createdAt,
    };
  }

  async create(data): Promise<Resume> {
    const model = await this.prisma.resume.create({ data });
    return this.toDomain(model); // ✅ Map before returning
  }

  async findById(id: string): Promise<Resume | null> {
    const model = await this.prisma.resume.findUnique({ where: { id } });
    return model ? this.toDomain(model) : null;
  }
}
```

#### Step 5: Create the Controller (Presentation)

```typescript
// modules/resume/presentation/controllers/resume.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ResumeService } from '../../application/use-cases/resume.service';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  create(@Body() dto: CreateResumeDto) {
    return this.resumeService.createResume(dto);
  }
}
```

#### Step 6: Wire Everything in the Module

```typescript
// modules/resume/resume.module.ts
import { Module } from '@nestjs/common';
import { ResumeService } from './application/use-cases/resume.service';
import { ResumeController } from './presentation/controllers/resume.controller';
import { RESUME_REPOSITORY_TOKEN } from './domain/ports/resume.repository';
import { PrismaResumeRepository } from './infrastructure/adapters/prisma-resume.repository';

@Module({
  controllers: [ResumeController],
  providers: [
    ResumeService,
    {
      provide: RESUME_REPOSITORY_TOKEN,
      useClass: PrismaResumeRepository,
    },
  ],
  exports: [ResumeService],
})
export class ResumeModule {}
```

### 4. Key Rules

| ✅ DO                                         | ❌ DON'T                          |
| --------------------------------------------- | --------------------------------- |
| Keep Domain layer pure (no NestJS decorators) | Import Infrastructure in Domain   |
| Use Interfaces (Ports) for dependencies       | Inject concrete classes directly  |
| Put business logic in Application layer       | Put business logic in Controllers |
| Use `@Inject(TOKEN)` for interfaces           | Hardcode implementations          |

### 5. Benefits of This Structure

1. **Testability**: Mock interfaces easily in unit tests
2. **Flexibility**: Swap implementations (e.g., Prisma → TypeORM) without changing business logic
3. **Maintainability**: Each module is self-contained
4. **Scalability**: Easy to extract modules to separate microservices

### 6. Quick Reference: Import Paths

```typescript
// Within a module (relative imports are OK)
import { Resume } from '../domain/entities/resume.entity';

// Across modules (use path aliases)
import { UserService } from '@user-service/modules/user/application/use-cases/user.service';

// Common utilities
import { Env } from '@user-service/common/constants/env.constant';

// Shared libraries (cross-service)
import { ServiceName } from '@shared/constants/index';
```
