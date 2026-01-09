import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Env } from '@resume-service/common/constants/env.constant';
import {
  ResumeMongoSchema,
  ResumeSchema,
} from '@resume-service/modules/resume/infrastructure/database/schemas/resume.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(Env.MONGODB_URI),
      }),
    }),
    MongooseModule.forFeature([
      { name: ResumeSchema.name, schema: ResumeMongoSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
