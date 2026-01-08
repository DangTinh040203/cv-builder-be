import { Module } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '@user-service/modules/user/domain/ports/user.repository';
import { PrismaAdapterUserRepository } from '@user-service/modules/user/infrastructure/adapters/prisma-adapter-user.repo';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaAdapterUserRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserRepositoryModule {}
