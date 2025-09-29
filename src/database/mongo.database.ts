import { type DynamicModule, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { type Connection } from 'mongoose';

import { Env } from '@/common/constants/env.constant';
import { type AbstractDbConnection } from '@/database/database.module';

export class MongoConnection implements AbstractDbConnection {
  private databaseConnectionFactory(config: ConfigService) {
    const nodeEnv = config.get<string>(Env.NODE_ENV) ?? 'development';
    const uri = config.get<string>(Env.MONGO_CONNECTION_STRING);

    return {
      uri,
      connectionFactory: (connection: Connection): Connection => {
        connection.on('connected', () => {
          Logger.warn(`✅ [${nodeEnv}] Database connected.`);
        });
        connection.on('disconnected', () => {
          Logger.warn(`❌ [${nodeEnv}] Database disconnected.`);
        });
        connection.on('error', (error) => {
          Logger.error(`❌ [${nodeEnv}] Database connection error:`, error);
        });
        return connection;
      },
    };
  }

  setup(): DynamicModule {
    return MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        this.databaseConnectionFactory(configService),
    });
  }
}
