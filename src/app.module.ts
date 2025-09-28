import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { envFilePath, validationSchema } from '@/common/configs/env.config';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: () => ({
        stores: [new KeyvRedis('redis://localhost:6379')],
      }),
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
