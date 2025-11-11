import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UtilsService } from '@/lib/utils/utils.service';
import { Resume } from '@/user/entities/resume.entity';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Resume.name) private resumeModel: Model<Resume>,
    private readonly utilsService: UtilsService,
  ) {}

  async create(resume: Omit<Resume, '_id'>) {
    return this.resumeModel.create(resume);
  }

  async update(
    resumeId: string,
    userId: string,
    resume: Partial<Omit<Resume, '_id' | 'userId'>>,
  ): Promise<Resume | null> {
    const exist = await this.resumeModel
      .findOne({
        _id: this.utilsService.convertToObjectId(resumeId),
        userId,
      })
      .lean();

    if (!exist) {
      throw new NotFoundException('Resume not found');
    }

    const updated = await this.resumeModel.findOneAndUpdate(
      {
        userId,
        _id: this.utilsService.convertToObjectId(resumeId),
      },
      resume,
      { new: true },
    );

    if (!updated) {
      throw new InternalServerErrorException('Failed to update resume');
    }

    return updated;
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
