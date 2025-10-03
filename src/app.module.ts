import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/common/configs/app-config.module';
import { EmailModule } from '@/email/email.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [AppConfigModule, AuthModule, UserModule, EmailModule],
  controllers: [AppController],
})
export class AppModule {}
