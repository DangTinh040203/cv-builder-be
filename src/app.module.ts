import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/common/configs/app-config.module';
import { CvModule } from '@/cv/cv.module';
import { EmailModule } from '@/email/email.module';
import { UploadModule } from '@/upload/upload.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    UserModule,
    EmailModule,
    UploadModule,
    CvModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
