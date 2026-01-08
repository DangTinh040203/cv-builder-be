import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@user-service/modules/user/infrastructure/database/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
