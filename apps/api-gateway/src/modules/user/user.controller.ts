import { Controller, Inject } from '@nestjs/common';
import { type ClientProxy } from '@nestjs/microservices';
import { ServiceName } from '@shared/constants/index';

@Controller('users')
export class UserController {
  constructor(
    @Inject(ServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}
}
