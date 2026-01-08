import { Injectable } from '@nestjs/common';
import { type User } from '@user-service/modules/user/domain/entities/user.entity';
import {
  type IUserRepository,
  type UserMutationType,
} from '@user-service/modules/user/domain/ports/user.repository';
import { type User as PrismaUser } from '@user-service/modules/user/infrastructure/database/prisma/generated/prisma/client';
import { PrismaService } from '@user-service/modules/user/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaAdapterUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(model: PrismaUser): User {
    return {
      id: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      avatar: model.avatar,
      email: model.email,
      provider: model.provider,
      providerId: model.providerId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async create(user: UserMutationType): Promise<User> {
    const model = await this.prisma.user.create({
      data: {
        avatar: user.avatar,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: user.provider,
        providerId: user.providerId,
      },
    });

    return this.toDomain(model);
  }

  async findById(id: string): Promise<User> {
    const model = await this.prisma.user.findUnique({
      where: { id },
    });

    return this.toDomain(model);
  }

  async findByEmail(email: string): Promise<User> {
    const model = await this.prisma.user.findUnique({
      where: { email },
    });

    return this.toDomain(model);
  }

  async update(id: string, updates: Partial<UserMutationType>): Promise<User> {
    const model = await this.prisma.user.update({
      where: { id },
      data: { ...updates },
    });

    return this.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
