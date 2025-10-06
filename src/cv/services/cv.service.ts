import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CV } from '@/cv/entities/cv.entity';

@Injectable()
export class CvService {
  constructor(@InjectModel(CV.name) private readonly cvModel: Model<CV>) {}

  async createCv(cv: Omit<CV, '_id'>) {
    return await this.cvModel.create(cv);
  }

  async findById(cvId: string) {
    return await this.cvModel.findById(cvId).lean().exec();
  }

  async findByUserId(userId: string) {
    return await this.cvModel.findOne({ userId }).lean().exec();
  }

  async updateCv(cvId: string, cv: Partial<CV>) {
    return await this.cvModel
      .findByIdAndUpdate(cvId, cv, { new: true })
      .lean()
      .exec();
  }

  async deleteCv(cvId: string) {
    return await this.cvModel.findByIdAndDelete(cvId).lean().exec();
  }
}
