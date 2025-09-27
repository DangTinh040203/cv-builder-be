import { DynamicModule, Module } from '@nestjs/common';

import { MongoConnection } from '@/database/mongo.database';

export enum DbType {
  Mongo = 'mongo',
}

export interface AbstractDbConnection {
  setup(): DynamicModule;
}

@Module({})
export class DatabaseModule {
  private static dbConnections: Record<DbType, DynamicModule> = {
    [DbType.Mongo]: new MongoConnection().setup(),
  };

  static forRootAsync(dbType: DbType): DynamicModule {
    return this.dbConnections[dbType];
  }
}
