#!/bin/bash

# Module Generator for Clean Architecture
# Usage: ./scripts/generate-module.sh <service-name> <module-name>
# Example: ./scripts/generate-module.sh user-service resume

set -e

SERVICE_NAME=$1
MODULE_NAME=$2

if [ -z "$SERVICE_NAME" ] || [ -z "$MODULE_NAME" ]; then
  echo "❌ Error: Missing arguments"
  echo "Usage: ./scripts/generate-module.sh <service-name> <module-name>"
  echo "Example: ./scripts/generate-module.sh user-service resume"
  exit 1
fi

# 1. Helper function for PascalCase (Works on Mac & Linux)
to_pascal_case() {
  echo "$1" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1' OFS=""
}

# 2. Helper function for UPPER_SNAKE_CASE (Works on Mac & Linux)
to_upper_snake_case() {
  echo "$1" | tr '-' '_' | tr '[:lower:]' '[:upper:]'
}

PASCAL_CASE=$(to_pascal_case "$MODULE_NAME")
UPPER_SNAKE_CASE=$(to_upper_snake_case "$MODULE_NAME")
BASE_PATH="apps/$SERVICE_NAME/src/modules/$MODULE_NAME"

echo "🚀 Generating module: $MODULE_NAME ($PASCAL_CASE) in $SERVICE_NAME"

# Create directory structure
mkdir -p "$BASE_PATH/domain/entities"
mkdir -p "$BASE_PATH/domain/ports"
mkdir -p "$BASE_PATH/application/use-cases"
mkdir -p "$BASE_PATH/infrastructure/adapters"
mkdir -p "$BASE_PATH/presentation/controllers"

# --- 1. Generate Entity ---
cat > "$BASE_PATH/domain/entities/$MODULE_NAME.entity.ts" << EOF
export interface ${PASCAL_CASE} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add your entity fields here
}
EOF

# --- 2. Generate Repository Port (Interface) ---
cat > "$BASE_PATH/domain/ports/$MODULE_NAME.repository.ts" << EOF
import { type ${PASCAL_CASE} } from '../entities/${MODULE_NAME}.entity';

export const ${UPPER_SNAKE_CASE}_REPOSITORY_TOKEN = '${UPPER_SNAKE_CASE}_REPOSITORY_TOKEN';

export type ${PASCAL_CASE}CreateInput = Omit<${PASCAL_CASE}, 'id' | 'createdAt' | 'updatedAt'>;
export type ${PASCAL_CASE}UpdateInput = Partial<${PASCAL_CASE}CreateInput>;

export interface I${PASCAL_CASE}Repository {
  create(data: ${PASCAL_CASE}CreateInput): Promise<${PASCAL_CASE}>;
  findById(id: string): Promise<${PASCAL_CASE} | null>;
  findAll(): Promise<${PASCAL_CASE}[]>;
  update(id: string, data: ${PASCAL_CASE}UpdateInput): Promise<${PASCAL_CASE}>;
  delete(id: string): Promise<void>;
}
EOF

# --- 3. Generate Service (Use Case) ---
cat > "$BASE_PATH/application/use-cases/$MODULE_NAME.service.ts" << EOF
import { Inject, Injectable } from '@nestjs/common';
import {
  type I${PASCAL_CASE}Repository,
  ${UPPER_SNAKE_CASE}_REPOSITORY_TOKEN,
  type ${PASCAL_CASE}CreateInput,
} from '../../domain/ports/${MODULE_NAME}.repository';

@Injectable()
export class ${PASCAL_CASE}Service {
  constructor(
    @Inject(${UPPER_SNAKE_CASE}_REPOSITORY_TOKEN)
    private readonly ${MODULE_NAME}Repository: I${PASCAL_CASE}Repository,
  ) {}

  async create(data: ${PASCAL_CASE}CreateInput) {
    return this.${MODULE_NAME}Repository.create(data);
  }

  async findById(id: string) {
    return this.${MODULE_NAME}Repository.findById(id);
  }

  async findAll() {
    return this.${MODULE_NAME}Repository.findAll();
  }
}
EOF

# --- 4. Generate Prisma Adapter ---
# Note: Assumes PrismaService is in the common infrastructure or database module
cat > "$BASE_PATH/infrastructure/adapters/prisma-$MODULE_NAME.repository.ts" << EOF
import { Injectable } from '@nestjs/common';
import { type ${PASCAL_CASE} } from '../../domain/entities/${MODULE_NAME}.entity';
import {
  type I${PASCAL_CASE}Repository,
  type ${PASCAL_CASE}CreateInput,
  type ${PASCAL_CASE}UpdateInput,
} from '../../domain/ports/${MODULE_NAME}.repository';
// TODO: Adjust import path to your PrismaService
// import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class Prisma${PASCAL_CASE}Repository implements I${PASCAL_CASE}Repository {
  // constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps Prisma model to Domain entity
   * IMPORTANT: Always map DB models to domain entities!
   */
  private toDomain(model: any): ${PASCAL_CASE} {
    return {
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      // TODO: Map other fields
    };
  }

  async create(data: ${PASCAL_CASE}CreateInput): Promise<${PASCAL_CASE}> {
    // const model = await this.prisma.${MODULE_NAME}.create({ data });
    // return this.toDomain(model);
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<${PASCAL_CASE} | null> {
    // const model = await this.prisma.${MODULE_NAME}.findUnique({ where: { id } });
    // return model ? this.toDomain(model) : null;
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<${PASCAL_CASE}[]> {
    // const models = await this.prisma.${MODULE_NAME}.findMany();
    // return models.map((m) => this.toDomain(m));
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: ${PASCAL_CASE}UpdateInput): Promise<${PASCAL_CASE}> {
    // const model = await this.prisma.${MODULE_NAME}.update({ where: { id }, data });
    // return this.toDomain(model);
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    // await this.prisma.${MODULE_NAME}.delete({ where: { id } });
    throw new Error('Method not implemented.');
  }
}
EOF

# --- 5. Generate Controller ---
cat > "$BASE_PATH/presentation/controllers/$MODULE_NAME.controller.ts" << EOF
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ${PASCAL_CASE}Service } from '../../application/use-cases/${MODULE_NAME}.service';

@Controller('${MODULE_NAME}s')
export class ${PASCAL_CASE}Controller {
  constructor(private readonly ${MODULE_NAME}Service: ${PASCAL_CASE}Service) {}

  @Post()
  create(@Body() data: any) {
    return this.${MODULE_NAME}Service.create(data);
  }

  @Get()
  findAll() {
    return this.${MODULE_NAME}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${MODULE_NAME}Service.findById(id);
  }
}
EOF

# --- 6. Generate Module Wiring ---
cat > "$BASE_PATH/$MODULE_NAME.module.ts" << EOF
import { Module } from '@nestjs/common';
import { ${PASCAL_CASE}Service } from './application/use-cases/${MODULE_NAME}.service';
import { ${PASCAL_CASE}Controller } from './presentation/controllers/${MODULE_NAME}.controller';
import { ${UPPER_SNAKE_CASE}_REPOSITORY_TOKEN } from './domain/ports/${MODULE_NAME}.repository';
import { Prisma${PASCAL_CASE}Repository } from './infrastructure/adapters/prisma-${MODULE_NAME}.repository';

@Module({
  controllers: [${PASCAL_CASE}Controller],
  providers: [
    ${PASCAL_CASE}Service,
    {
      provide: ${UPPER_SNAKE_CASE}_REPOSITORY_TOKEN,
      useClass: Prisma${PASCAL_CASE}Repository,
    },
  ],
  exports: [${PASCAL_CASE}Service],
})
export class ${PASCAL_CASE}Module {}
EOF

echo "✅ Module '$MODULE_NAME' generated successfully inside '$SERVICE_NAME'!"
echo ""
echo "👉 Next steps:"
echo "  1. Add model '${PASCAL_CASE}' to schema.prisma"
echo "  2. Update domain/entities/${MODULE_NAME}.entity.ts"
echo "  3. Uncomment PrismaService in infrastructure/adapters/prisma-${MODULE_NAME}.repository.ts"
echo "  4. Import ${PASCAL_CASE}Module in your AppModule"