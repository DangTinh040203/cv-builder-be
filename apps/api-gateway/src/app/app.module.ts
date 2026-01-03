import { validationSchema } from '@api-gateway/common/configs/env.config';
import { UserModule } from '@api-gateway/modules/user/user.module';
import { WebhookModule } from '@api-gateway/modules/webhooks/webhook.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),

    WebhookModule,
    UserModule,
  ],
})
export class AppModule {}
