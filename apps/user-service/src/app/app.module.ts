import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@user-service/common/configs/env.config';
import { DatabaseModule } from '@user-service/common/database/database.module';
import { UserModule } from '@user-service/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    UserModule,
    DatabaseModule,
  ],
})
export class AppModule {}
