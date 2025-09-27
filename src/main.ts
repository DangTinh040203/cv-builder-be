import {
  type INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppModule } from '@/app.module';
import { Env } from '@/common/constants/env.constant';
import { HttpExceptionFilter } from '@/common/filters/exception.filter';

class BootstrapApplication {
  app: INestApplication;
  private configService: ConfigService;

  async run() {
    this.app = await NestFactory.create(AppModule);

    this.app.setGlobalPrefix('api');
    this.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    this.app.enableShutdownHooks();
    this.configService = this.app.get(ConfigService);
    const port = this.configService.getOrThrow<number>(Env.PORT);

    this.setupMiddleware();

    await this.app.startAllMicroservices();

    await this.app.listen(port);
    Logger.log(
      `Server running on http://localhost:${port}`,
      'BootstrapApplication',
    );
  }

  private setupMiddleware() {
    this.app.use(cookieParser());
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    this.app.useGlobalFilters(new HttpExceptionFilter());
    this.app.enableCors({});
    this.app.use(helmet());
    this.app.use(morgan('dev'));
  }
}

void new BootstrapApplication().run();
