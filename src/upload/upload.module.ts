import { Module } from '@nestjs/common';

import { UploadService } from '@/upload/services/upload.service';
import { UploadController } from '@/upload/upload.controller';

@Module({
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
