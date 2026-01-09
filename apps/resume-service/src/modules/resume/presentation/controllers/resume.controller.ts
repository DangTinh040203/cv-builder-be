import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResumeService } from '@resume-service/modules/resume/application/use-cases/resume.service';
import { type ResumeMutationType } from '@resume-service/modules/resume/domain/ports/resume.repository';

// Message patterns for resume service
export const ResumePatterns = {
  CREATE: 'resume.create',
  FIND_BY_ID: 'resume.findById',
  FIND_BY_USER_ID: 'resume.findByUserId',
  UPDATE: 'resume.update',
  DELETE: 'resume.delete',
} as const;

@Controller()
export class ResumeController {
  private readonly logger = new Logger(ResumeController.name);

  constructor(private readonly resumeService: ResumeService) {}

  @MessagePattern(ResumePatterns.CREATE)
  createResume(@Payload() data: ResumeMutationType) {
    this.logger.log('Creating resume:', {
      userId: data.userId,
      title: data.title,
    });
    return this.resumeService.createResume(data);
  }

  @MessagePattern(ResumePatterns.FIND_BY_ID)
  findById(@Payload() id: string) {
    this.logger.log('Finding resume by id:', { id });
    return this.resumeService.getResumeById(id);
  }

  @MessagePattern(ResumePatterns.FIND_BY_USER_ID)
  findByUserId(@Payload() userId: string) {
    this.logger.log('Finding resumes by userId:', { userId });
    return this.resumeService.getResumesByUserId(userId);
  }

  @MessagePattern(ResumePatterns.UPDATE)
  updateResume(
    @Payload() data: { id: string; updates: Partial<ResumeMutationType> },
  ) {
    this.logger.log('Updating resume:', { id: data.id });
    return this.resumeService.updateResume(data.id, data.updates);
  }

  @MessagePattern(ResumePatterns.DELETE)
  deleteResume(@Payload() id: string) {
    this.logger.log('Deleting resume:', { id });
    return this.resumeService.deleteResume(id);
  }
}
