import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Resume, ResumeSchema } from '@/user/entities/resume.entity';
import { User, UserSchema } from '@/user/entities/user.entity';
import { ResumeService } from '@/user/services/resume.service';
import { UserService } from '@/user/services/user.service';
import { UserController } from '@/user/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ResumeService],
  exports: [UserService, ResumeService, MongooseModule],
})
export class UserModule {}
