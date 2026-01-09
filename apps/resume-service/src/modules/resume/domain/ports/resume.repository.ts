import { type Resume } from '@resume-service/modules/resume/domain/entities/resume.entity';

export const RESUME_REPOSITORY_TOKEN = 'RESUME_REPOSITORY_TOKEN';
export type ResumeMutationType = Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>;

export interface IResumeRepository {
  create(resume: ResumeMutationType): Promise<Resume>;
  findById(id: string): Promise<Resume | null>;
  findByUserId(userId: string): Promise<Resume[]>;
  update(id: string, updates: Partial<ResumeMutationType>): Promise<Resume>;
  delete(id: string): Promise<void>;
}
