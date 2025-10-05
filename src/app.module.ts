import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/common/configs/app-config.module';
import { EmailModule } from '@/email/email.module';
import { UploadModule } from '@/upload/upload.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [AppConfigModule, AuthModule, UserModule, EmailModule, UploadModule],
  controllers: [AppController],
})
export class AppModule {}
