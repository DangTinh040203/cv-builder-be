import { Module } from '@nestjs/common';

import { UploadFileServiceAbstract } from '@/upload/services/upload.abstract';
import { UploadService } from '@/upload/services/upload.service';
import { UploadController } from '@/upload/upload.controller';

@Module({
  providers: [
    {
      provide: UploadFileServiceAbstract,
      useClass: UploadService,
    },
  ],
  exports: [UploadFileServiceAbstract],
  controllers: [UploadController],
})
export class UploadModule {}
