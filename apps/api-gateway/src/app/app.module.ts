import { AppController } from '@api-gateway/app/app.controller';
import { validationSchema } from '@api-gateway/common/configs/env.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
