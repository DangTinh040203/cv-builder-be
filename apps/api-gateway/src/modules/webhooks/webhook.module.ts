import { UserModule } from '@api-gateway/modules/user/user.module';
import { WebhooksController } from '@api-gateway/modules/webhooks/webhook.controller';
import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  controllers: [WebhooksController],
  providers: [Logger],
  exports: [],
})
export class WebhookModule {}
