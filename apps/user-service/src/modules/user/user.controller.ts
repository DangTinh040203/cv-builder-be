import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/contracts/user/dtos/create-user.dto';
import { ClerkWebhookPatterns } from '@shared/contracts/user/user.patterns';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  @MessagePattern(ClerkWebhookPatterns.USER_CREATED)
  webhookCreateUser(@Payload() message: CreateUserDto) {
    this.logger.log('Received USER_CREATED webhook');
    this.logger.debug('Webhook payload:', JSON.stringify(message, null, 2));
  }
}
