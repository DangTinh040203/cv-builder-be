import { Logger, Module } from '@nestjs/common';
import { UserController } from '@user-service/modules/user/user.controller';
import { UserService } from '@user-service/modules/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {}
