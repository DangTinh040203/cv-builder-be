# API Documentation

This project uses [Swagger (OpenAPI)](https://swagger.io/) for API documentation.

## Accessing Swagger UI

When running the API Gateway, Swagger UI is available at:

```text
http://localhost:3000/api/docs
```

---

## Swagger Decorators Guide

### Controller Decorators

#### `@ApiTags()`

Group endpoints by tag in Swagger UI:

```typescript
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users') // All endpoints grouped under "users"
@Controller('users')
export class UserController {}
```

#### `@ApiOperation()`

Describe what an endpoint does:

```typescript
import { Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Get()
@ApiOperation({
  summary: 'Get all users',
  description: 'Returns a list of all registered users'
})
findAll() {}
```

#### `@ApiResponse()`

Document possible responses:

```typescript
import { ApiResponse } from '@nestjs/swagger';

@Get(':id')
@ApiResponse({ status: 200, description: 'User found' })
@ApiResponse({ status: 404, description: 'User not found' })
findOne(@Param('id') id: string) {}
```

#### `@ApiBearerAuth()`

Mark endpoint as requiring authentication:

```typescript
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Get('profile')
getProfile() {}
```

---

### Parameter Decorators

#### `@ApiParam()`

Document path parameters:

```typescript
import { ApiParam } from '@nestjs/swagger';

@Get(':id')
@ApiParam({ name: 'id', description: 'User ID', example: '123' })
findOne(@Param('id') id: string) {}
```

#### `@ApiQuery()`

Document query parameters:

```typescript
import { ApiQuery } from '@nestjs/swagger';

@Get()
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'limit', required: false, example: 10 })
findAll(@Query('page') page: number, @Query('limit') limit: number) {}
```

#### `@ApiBody()`

Document request body:

```typescript
import { ApiBody } from '@nestjs/swagger';

@Post()
@ApiBody({ type: CreateUserDto, description: 'User data' })
create(@Body() dto: CreateUserDto) {}
```

---

### DTO Decorators

#### `@ApiProperty()`

Document required DTO properties:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  name: string;
}
```

#### `@ApiPropertyOptional()`

Document optional properties:

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'User bio',
    example: 'Software developer',
  })
  bio?: string;
}
```

#### `@ApiProperty()` with enums

```typescript
import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
```

#### `@ApiProperty()` with arrays

```typescript
@ApiProperty({ type: [String], example: ['tag1', 'tag2'] })
tags: string[];
```

---

### Response Type Decorators

#### `@ApiOkResponse()`

Shorthand for 200 response with type:

```typescript
import { ApiOkResponse } from '@nestjs/swagger';

@Get()
@ApiOkResponse({ type: [UserDto], description: 'List of users' })
findAll(): UserDto[] {}
```

#### Other Response Shortcuts

| Decorator                    | Status Code |
| ---------------------------- | ----------- |
| `@ApiCreatedResponse()`      | 201         |
| `@ApiBadRequestResponse()`   | 400         |
| `@ApiUnauthorizedResponse()` | 401         |
| `@ApiForbiddenResponse()`    | 403         |
| `@ApiNotFoundResponse()`     | 404         |

---

## Complete Example

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserDto] })
  findAll(): UserDto[] {
    return [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id') id: string): UserDto {
    return {} as UserDto;
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: UserDto })
  create(@Body() dto: CreateUserDto): UserDto {
    return {} as UserDto;
  }
}
```

---

## Configuration

Swagger is configured in bootstrap options:

```typescript
{
  swagger: {
    title: 'CV Builder API',
    description: 'API documentation for CV Builder backend services',
    version: '1.0',
    path: 'docs',
  },
}
```
