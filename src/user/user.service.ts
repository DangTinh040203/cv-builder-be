import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Env } from '@/common/constants/env.constant';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(user: Omit<User, '_id' | 'slug'>) {
    return this.userModel.create({
      avatar: this.configService.get(Env.DEFAULT_USER_AVATAR),
      displayName: user.email.split('@')[0],
      email: user.email,
    });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }
}
