import { AppModule } from '@api-gateway/app/app.module';
import { Env } from '@api-gateway/config';
import { bootstrapApplication } from '@libs/configs/index';
import { ServiceName } from '@libs/constants/index';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

void bootstrapApplication(
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
  // ConfigResolver - called after app creation with access to ConfigService
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
