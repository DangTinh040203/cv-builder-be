import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadFileServiceAbstract } from '@/upload/services/upload.abstract';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadFileServiceAbstract) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile('cv-builder', file);
  }
}
