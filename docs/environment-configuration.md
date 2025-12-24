# Environment Configuration

Each microservice has its own environment configuration with Joi validation.

## Per-Service Environment Setup

Each service manages its own environment variables in:

> [!NOTE]
> The `api-gateway` config module is currently **not implemented**. The structure below is the planned target.

```text
apps/<service-name>/
├── src/
│   └── common/
│       └── configs/
│           ├── env.constant.ts    # Env enum with variable keys
│           ├── env.schema.ts      # Joi validation schema
│           ├── config.module.ts   # ConfigModule setup
│           └── index.ts           # Exports
└── .env.example                   # Example env file
```

## Example: API Gateway

### 1. Define Environment Variables (`env.constant.ts`)

```typescript
export enum Env {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  FRONTEND_ORIGIN = 'FRONTEND_ORIGIN',
  JWT_SECRET = 'JWT_SECRET',
  REDIS_URL = 'REDIS_URL',
}
```

### 2. Create Validation Schema (`env.schema.ts`)

```typescript
import Joi from 'joi';
import { Env } from '@api-gateway/config/env.constant';

export const envValidationSchema = Joi.object({
  [Env.PORT]: Joi.number().port().required(),
  [Env.NODE_ENV]: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  [Env.FRONTEND_ORIGIN]: Joi.string().uri().required(),
  [Env.JWT_SECRET]: Joi.string().min(32).required(),
  [Env.REDIS_URL]: Joi.string().uri().required(),
});
```

### 3. Configure Module (`config.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '@api-gateway/config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
  ],
})
export class AppConfigModule {}
```

### 4. Use in main.ts with ConfigResolver

```typescript
import { ConfigService } from '@nestjs/config';
import { Env } from '@api-gateway/config';

void bootstrapApplication(
  {
    appModule: AppModule,
    serviceName: ServiceName.API_GATEWAY,
    // ... static config
  },
  // ConfigResolver - called after app creation
  (app) => {
    const configService = app.get(ConfigService);
    return {
      port: configService.getOrThrow<number>(Env.PORT),
      cors: {
        origin: configService.getOrThrow<string>(Env.FRONTEND_ORIGIN),
        credentials: true,
      },
      versioning: { type: VersioningType.URI, defaultVersion: '1' },
    };
  },
);
```

## Validation Behavior

- **Missing required variable**: App fails to start with descriptive error
- **Invalid type**: Joi throws validation error at startup
- **Unknown variables**: Allowed (won't cause errors)

## Creating Config for New Service

1. Copy the `config/` folder structure from `api-gateway`
2. Modify `env.constant.ts` with service-specific variables
3. Update `env.schema.ts` with appropriate validations
4. Import `AppConfigModule` in your service's `AppModule`
5. Create `.env.example` with all required variables
