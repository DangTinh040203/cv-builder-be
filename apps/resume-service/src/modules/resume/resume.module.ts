import { Logger, Module } from '@nestjs/common';
import { ResumeService } from '@resume-service/modules/resume/application/use-cases/resume.service';
import { ResumeRepositoryModule } from '@resume-service/modules/resume/infrastructure/adapters/resume-repository.module';
import { ResumeController } from '@resume-service/modules/resume/presentation/controllers/resume.controller';

@Module({
  imports: [ResumeRepositoryModule],
  controllers: [ResumeController],
  providers: [ResumeService, Logger],
  exports: [ResumeService],
})
export class ResumeModule {}
