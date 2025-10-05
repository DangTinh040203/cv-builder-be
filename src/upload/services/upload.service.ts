import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';

import { Env } from '@/common/constants/env.constant';
import { UploadFileServiceAbstract } from '@/upload/services/upload.abstract';

@Injectable()
export class UploadService implements UploadFileServiceAbstract {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>(Env.AWS_REGION),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>(Env.AWS_ACCESS_KEY),
        secretAccessKey: this.configService.getOrThrow<string>(
          Env.AWS_SECRET_KEY,
        ),
      },
    });
  }

  async generatePresignedUrl(fileKey: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.getOrThrow(Env.AWS_BUCKET_NAME),
        Key: fileKey,
        ResponseContentDisposition: `attachment; filename="${encodeURIComponent(fileKey)}"`,
      });

      const TTL = 60; // 1 mins
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: TTL,
      });

      return url;
    } catch (error) {
      Logger.error('Error generating presigned URL', error);
      throw new InternalServerErrorException();
    }
  }

  async uploadFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    try {
      const timestamp = Date.now().toString();
      const safeFileName = slugify(file.originalname);
      const s3BucketKey = `${path}/${timestamp}_${safeFileName}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: this.configService.get(Env.AWS_BUCKET_NAME),
        Key: s3BucketKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(uploadCommand);

      return {
        url: `${this.configService.getOrThrow(Env.CLOUDFRONT_URL)}/${s3BucketKey}`,
        key: s3BucketKey,
      };
    } catch (error) {
      Logger.error('Error uploading file to S3', error);
      throw new InternalServerErrorException();
    }
  }
}
