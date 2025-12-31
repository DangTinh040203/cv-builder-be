import 'dotenv/config';

import type { Type } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceBootstrap } from '@shared/configs/bootstrap-microservice.config';
import { ServiceName } from '@shared/constants/index';
import { Env } from '@user-service/common/constants/env.constant';

export class UserServiceBootstrap extends MicroserviceBootstrap {
  protected readonly serviceName = ServiceName.USER_SERVICE;
  protected readonly transport = Transport.TCP;
  protected readonly transportOptions = {
    host: process.env[Env.TCP_HOST],
    port: Number(process.env[Env.TCP_PORT]),
  };
  protected readonly appModule: Type<unknown>;

  constructor(appModule: Type<unknown>) {
    super();
    this.appModule = appModule;
  }
}
