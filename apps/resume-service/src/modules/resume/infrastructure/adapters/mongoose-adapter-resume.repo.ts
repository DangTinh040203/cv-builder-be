import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Resume } from '@resume-service/modules/resume/domain/entities/resume.entity';
import {
  type IResumeRepository,
  type ResumeMutationType,
} from '@resume-service/modules/resume/domain/ports/resume.repository';
import {
  type ResumeDocument,
  ResumeSchema,
} from '@resume-service/modules/resume/infrastructure/database/schemas/resume.schema';
import { Model } from 'mongoose';

@Injectable()
export class MongooseAdapterResumeRepository implements IResumeRepository {
  constructor(
    @InjectModel(ResumeSchema.name)
    private readonly resumeModel: Model<ResumeDocument>,
  ) {}

  private toDomain(doc: ResumeDocument): Resume {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt ?? new Date(),
      updatedAt: doc.updatedAt ?? new Date(),
    };
  }

  async create(data: ResumeMutationType): Promise<Resume> {
    const doc = await this.resumeModel.create({
      userId: data.userId,
      title: data.title,
      content: data.content,
    });

    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Resume | null> {
    const doc = await this.resumeModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<Resume[]> {
    const docs = await this.resumeModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => this.toDomain(doc));
  }

  async update(
    id: string,
    updates: Partial<ResumeMutationType>,
  ): Promise<Resume> {
    const doc = await this.resumeModel
      .findByIdAndUpdate(id, { $set: updates }, { new: true })
      .exec();

    if (!doc) {
      throw new Error(`Resume with id ${id} not found`);
    }

    return this.toDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await this.resumeModel.findByIdAndDelete(id).exec();
  }
}
