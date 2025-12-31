import { AppModule } from '@api-gateway/app/app.module';
import { bootstrapGateway } from '@api-gateway/bootstrap';
import { Env } from '@api-gateway/common/constants/env.constant';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceName } from '@shared/constants/index';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

void bootstrapGateway(
  {
    appModule: AppModule,
    serviceName: ServiceName.API_GATEWAY,
    globalPrefix: 'api',
    loggerOptions: {
      json: true,
      colors: true,
    },
    middlewares: [cookieParser(), helmet(), morgan('dev')],
    pipes: [
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    ],
    filters: [],
    interceptors: [],
    microservices: [],
    enableShutdownHooks: true,
  },
  (app) => {
    const configService = app.get(ConfigService);
    return {
      port: configService.getOrThrow<number>(Env.PORT),
      versioning: {
        type: VersioningType.URI,
        defaultVersion: '1',
      },
      cors: {
        origin: configService.getOrThrow<string>(Env.FRONTEND_ORIGIN),
        credentials: true,
      },
    };
  },
);
