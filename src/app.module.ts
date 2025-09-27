import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { envFilePath, validationSchema } from '@/common/configs/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
