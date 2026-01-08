# Code Conventions

This document outlines the coding standards and conventions for the CV Builder backend.

## General Principles

1. **Consistency** - Follow existing patterns in the codebase
2. **Readability** - Write code that is easy to understand
3. **Maintainability** - Write code that is easy to modify
4. **Type Safety** - Leverage TypeScript's type system fully

## TypeScript Guidelines

### Naming Conventions

| Type        | Convention      | Example           |
| ----------- | --------------- | ----------------- |
| Classes     | PascalCase      | `UserService`     |
| Interfaces  | PascalCase      | `UserRepository`  |
| Types       | PascalCase      | `CreateUserDto`   |
| Functions   | camelCase       | `createUser`      |
| Variables   | camelCase       | `userId`          |
| Constants   | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Enums       | PascalCase      | `UserRole`        |
| Enum values | SCREAMING_SNAKE | `UserRole.ADMIN`  |
| Files       | kebab-case      | `user.service.ts` |

### Type Annotations

```typescript
// ✅ Good - Explicit return types for public methods
async getUser(id: string): Promise<User> {
  return this.userRepository.findById(id);
}

// ❌ Bad - Avoid using 'any'
function processData(data: any): any {
  // ...
}

// ✅ Good - Use proper types
function processData(data: UserData): ProcessedData {
  // ...
}
```

### Avoid `any` Type

- Never use `any` unless absolutely necessary
- Use `unknown` if the type is truly unknown, then narrow it
- Create proper interfaces/types for all data structures

## NestJS Conventions

### Modular Clean Architecture

We follow **Vertical Slicing** where each feature module contains its full stack:

```
modules/<feature>/
├── domain/                     # Pure logic, no framework
│   ├── entities/
│   │   └── <feature>.entity.ts # Domain entities (plain interfaces)
│   └── ports/
│       └── <feature>.repository.ts  # Interfaces (IRepository)
├── application/                # Use cases / Services
│   └── use-cases/
│       └── <feature>.service.ts     # Business logic
├── infrastructure/             # Implementation (DB, external)
│   ├── adapters/
│   │   └── prisma-<feature>.repository.ts  # Implements ports
│   └── database/               # Prisma, migrations (if module-specific)
├── presentation/               # API Layer
│   └── controllers/
│       └── <feature>.controller.ts
└── <feature>.module.ts         # Wire everything together
```

### Layer Rules

| Layer              | What Goes Here               | Can Import From       |
| ------------------ | ---------------------------- | --------------------- |
| **Domain**         | Entities, Interfaces (Ports) | Nothing (pure TS)     |
| **Application**    | Use Cases, Services          | Domain only           |
| **Infrastructure** | Repository implementations   | Domain, external libs |
| **Presentation**   | Controllers, DTOs            | Application, Domain   |

### Module Structure

```typescript
// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './application/use-cases/user.service';
import { UserController } from './presentation/controllers/user.controller';
import { USER_REPOSITORY_TOKEN } from './domain/ports/user.repository';
import { PrismaUserRepository } from './infrastructure/adapters/prisma-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN, // Interface token
      useClass: PrismaUserRepository, // Implementation
    },
  ],
  exports: [UserService],
})
export class UserModule {}
```

### Dependency Injection with Interfaces

```typescript
// ✅ Good - Inject via interface token
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}
}

// ❌ Bad - Direct implementation injection
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: PrismaUserRepository, // Breaks abstraction!
  ) {}
}
```

### DTOs (Data Transfer Objects)

```typescript
// ✅ Good - Use class-validator decorators
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
```

## Import Order

Imports should be ordered as follows:

1. App-specific imports (`@<service>/*`)
2. Shared libraries (`@shared/*`)
3. External packages (npm)
4. Node.js built-in modules

> **Important:** Relative imports (`./**`, `../**`) are NOT allowed. All imports must use `@` path aliases.

```typescript
// 1. App-specific imports
import { AppModule } from '@api-gateway/app/app.module';
import { Env } from '@api-gateway/common/config';

// 2. Shared libraries
import { bootstrapApplication } from '@shared/configs/index';
import { ServiceName } from '@shared/constants/index';

// 3. External packages
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 4. Node.js built-ins (if needed)
import { join } from 'path';
```

## Error Handling

### Use NestJS Built-in Exceptions

```typescript
// ✅ Good
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Access denied');

// ❌ Bad
throw new Error('User not found');
```

### Custom Business Exceptions

```typescript
// Create domain-specific exceptions when needed
export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
```

## Async/Await Best Practices

```typescript
// ✅ Good - Always await async operations
async createUser(dto: CreateUserDto): Promise<User> {
  const user = await this.userRepository.create(dto);
  await this.notificationService.sendWelcomeEmail(user);
  return user;
}

// ❌ Bad - Floating promises
async createUser(dto: CreateUserDto): Promise<User> {
  const user = await this.userRepository.create(dto);
  this.notificationService.sendWelcomeEmail(user); // Missing await!
  return user;
}
```

## Comments and Documentation

### JSDoc for Public APIs

```typescript
/**
 * Creates a new user in the system.
 * @param dto - The user creation data
 * @returns The newly created user
 * @throws UserAlreadyExistsException if email is already registered
 */
async createUser(dto: CreateUserDto): Promise<User> {
  // Implementation
}
```

### Inline Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Use soft delete to preserve referential integrity with interviews
await this.userRepository.softDelete(userId);

// ❌ Bad - States the obvious
// Delete the user
await this.userRepository.delete(userId);
```

## Git Conventions

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

| Type       | Description                          |
| ---------- | ------------------------------------ |
| `feat`     | New feature                          |
| `fix`      | Bug fix                              |
| `docs`     | Documentation changes                |
| `style`    | Code style changes (formatting, etc) |
| `update`   | Dependency or minor updates          |
| `refactor` | Code refactoring                     |
| `test`     | Adding or updating tests             |
| `chore`    | Maintenance tasks                    |
| `perf`     | Performance improvements             |
| `ci`       | CI/CD changes                        |
| `build`    | Build system changes                 |
| `revert`   | Reverting previous commit            |

**Examples:**

```
feat(user-service): add user profile update endpoint
fix(api-gateway): resolve authentication token refresh issue
docs(readme): update getting started guide
```

### Branch Naming

```
feature/<feature-name>
fix/<bug-description>
refactor/<area>
docs/<topic>
```

## Linting and Formatting

### ESLint

The project uses ESLint with TypeScript support. Run:

```bash
# Check for issues
pnpm run lint

# Auto-fix issues
pnpm run lint:fix
```

### Prettier

Code formatting is handled by Prettier. Configuration is in `.prettierrc`.

- Use single quotes
- Use semicolons
- 2 spaces for indentation
- 80 character line width (soft limit)

## Testing Conventions

### Test File Naming

```
user.service.ts          → user.service.spec.ts
user.controller.ts       → user.controller.spec.ts
```

### Test Structure

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const dto = { name: 'John', email: 'john@example.com' };

      // Act
      const result = await service.createUser(dto);

      // Assert
      expect(result.name).toBe('John');
    });

    it('should throw if email already exists', async () => {
      // ...
    });
  });
});
```
