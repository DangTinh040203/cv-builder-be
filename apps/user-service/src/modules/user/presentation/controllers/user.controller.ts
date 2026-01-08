import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/contracts/user/dtos/create-user.dto';
import { ClerkWebhookPatterns } from '@shared/contracts/user/user.patterns';
import { UserService } from '@user-service/modules/user/application/use-cases/user.service';

@Controller()
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @MessagePattern(ClerkWebhookPatterns.USER_CREATED)
  webhookCreateUser(@Payload() message: CreateUserDto) {
    this.logger.log('Received from CLERK Webhook :', { message });
    return this.userService.createUser(message);
  }
}
