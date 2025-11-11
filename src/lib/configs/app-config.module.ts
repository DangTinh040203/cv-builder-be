import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule, DbType } from '@/database/database.module';
import { MailerConfig } from '@/lib/configs/email.config';
import { envFilePath, validationSchema } from '@/lib/configs/env.config';
import { Env } from '@/lib/constants/env.constant';

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
    MailerConfig,
    JwtModule.registerAsync({
      imports: [],
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(Env.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(Env.JWT_EXPIRES_IN),
        },
      }),
    }),
  ],
})
export class AppConfigModule {}
