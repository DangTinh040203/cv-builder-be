import { Env } from '@api-gateway/common/constants/env.constant';
import { UserController } from '@api-gateway/modules/user/presentation/controllers/user.controller';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceName } from '@shared/constants/index';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ServiceName.USER_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>(Env.USER_SERVICE_HOST),
            port: configService.getOrThrow<number>(Env.USER_SERVICE_PORT),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  exports: [ClientsModule],
})
export class UserModule {}
