import { Controller, Get, Inject, Param } from '@nestjs/common';
import { type ClientProxy } from '@nestjs/microservices';
import { ServiceName } from '@shared/constants/index';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(
    @Inject(ServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}

  @Get('ping')
  async ping(): Promise<string> {
    return firstValueFrom(this.userClient.send<string>({ cmd: 'ping' }, {}));
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return firstValueFrom(this.userClient.send({ cmd: 'get_user' }, { id }));
  }
}
