import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Resume } from '@/user/entities/resume.entity';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Resume.name) private resumeModel: Model<Resume>,
    private readonly configService: ConfigService,
  ) {}

  async create(resume: Omit<Resume, '_id'>) {
    return this.resumeModel.create(resume);
  }

  async findByUserId(userId: string) {
    return this.resumeModel.findOne({ userId });
  }

  async updateByUserId(userId: string, resume: Partial<Resume>) {
    return this.resumeModel.findOneAndUpdate({ userId }, resume, { new: true });
  }

  async get(userId: string) {
    const resume = await this.resumeModel.findOne({ userId }).lean();
    return resume;
  }
}
