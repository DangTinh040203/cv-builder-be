import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@resume-service/common/configs/env.config';
import { DatabaseModule } from '@resume-service/modules/resume/infrastructure/database/database.module';
import { ResumeModule } from '@resume-service/modules/resume/resume.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    ResumeModule,
    DatabaseModule,
  ],
})
export class AppModule {}
