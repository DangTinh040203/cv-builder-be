import { Inject, Injectable } from '@nestjs/common';
import { type Resume } from '@resume-service/modules/resume/domain/entities/resume.entity';
import {
  type IResumeRepository,
  RESUME_REPOSITORY_TOKEN,
  type ResumeMutationType,
} from '@resume-service/modules/resume/domain/ports/resume.repository';

@Injectable()
export class ResumeService {
  constructor(
    @Inject(RESUME_REPOSITORY_TOKEN)
    private readonly resumeRepository: IResumeRepository,
  ) {}

  createResume(data: ResumeMutationType): Promise<Resume> {
    return this.resumeRepository.create(data);
  }

  getResumeById(id: string): Promise<Resume | null> {
    return this.resumeRepository.findById(id);
  }

  getResumesByUserId(userId: string): Promise<Resume[]> {
    return this.resumeRepository.findByUserId(userId);
  }

  updateResume(
    id: string,
    updates: Partial<ResumeMutationType>,
  ): Promise<Resume> {
    return this.resumeRepository.update(id, updates);
  }

  deleteResume(id: string): Promise<void> {
    return this.resumeRepository.delete(id);
  }
}
