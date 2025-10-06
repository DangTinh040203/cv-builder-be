import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CvController } from '@/cv/cv.controller';
import { CV, cvSchema } from '@/cv/entities/cv.entity';
import { CvService } from '@/cv/services/cv.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CV.name, schema: cvSchema }])],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
