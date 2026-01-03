import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClerkWebhookPatterns } from '@shared/contracts/user/user.patterns';
import { ClerkWebhook } from '@shared/types/index';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  @MessagePattern(ClerkWebhookPatterns.USER_CREATED)
  webhookCreateUser(@Payload() message: ClerkWebhook) {
    this.logger.log('Received USER_CREATED webhook');
    this.logger.debug('Webhook payload:', JSON.stringify(message, null, 2));
    return { success: true };
  }
}
