import { Logger, Module } from '@nestjs/common';
import { UserService } from '@user-service/modules/user/application/use-cases/user.service';
import { UserRepositoryModule } from '@user-service/modules/user/infrastructure/adapters/user-repository.module';
import { UserController } from '@user-service/modules/user/presentation/controllers/user.controller';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UserController],
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {}
