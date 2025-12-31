import { Controller, Get, Inject, Param } from '@nestjs/common';
import { type ClientProxy } from '@nestjs/microservices';
import { ServiceName } from '@shared/constants/index';
import { GetUserDto, UserPatterns } from '@shared/contracts/index';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(
    @Inject(ServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}

  @Get('ping')
  async ping(): Promise<string> {
    return firstValueFrom(this.userClient.send<string>(UserPatterns.PING, {}));
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const payload: GetUserDto = { id };
    return firstValueFrom(this.userClient.send(UserPatterns.GET_USER, payload));
  }
}
