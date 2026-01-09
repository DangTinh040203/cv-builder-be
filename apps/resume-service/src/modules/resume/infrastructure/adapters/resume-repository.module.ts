import { Module } from '@nestjs/common';
import { RESUME_REPOSITORY_TOKEN } from '@resume-service/modules/resume/domain/ports/resume.repository';
import { MongooseAdapterResumeRepository } from '@resume-service/modules/resume/infrastructure/adapters/mongoose-adapter-resume.repo';

@Module({
  providers: [
    {
      provide: RESUME_REPOSITORY_TOKEN,
      useClass: MongooseAdapterResumeRepository,
    },
  ],
  exports: [RESUME_REPOSITORY_TOKEN],
})
export class ResumeRepositoryModule {}
