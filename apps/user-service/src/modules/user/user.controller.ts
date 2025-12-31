import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserDto, UserPatterns } from '@shared/contracts/index';
import { UserService } from '@user-service/modules/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserPatterns.PING)
  ping(): string {
    return this.userService.ping();
  }

  @MessagePattern(UserPatterns.GET_USER)
  getUser(@Payload() data: GetUserDto) {
    return this.userService.getUser(data.id);
  }
}
