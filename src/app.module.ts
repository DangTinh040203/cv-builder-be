import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { envFilePath, validationSchema } from '@/common/configs/env.config';
import { Env } from '@/common/constants/env.constant';
import { DatabaseModule, DbType } from '@/database/database.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [new KeyvRedis(config.getOrThrow(Env.REDIS_CONNECTION_STRING))],
      }),
    }),
    DatabaseModule.forRootAsync(DbType.Mongo),
    EventEmitterModule.forRoot({ global: true }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
