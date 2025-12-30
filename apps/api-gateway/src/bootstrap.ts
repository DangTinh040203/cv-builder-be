import type {
  ConsoleLoggerOptions,
  ExceptionFilter,
  INestApplication,
  NestInterceptor,
  PipeTransform,
  VersioningOptions,
} from '@nestjs/common';
import { ConsoleLogger, Logger } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { ServiceName } from '@shared/constants/index';
import type { RequestHandler } from 'express';

export interface GatewayBootstrapOptions {
  appModule: new (...args: unknown[]) => unknown;
  serviceName: ServiceName;
  globalPrefix: string;
  loggerOptions: ConsoleLoggerOptions;
  middlewares: RequestHandler[];
  pipes: PipeTransform[];
  filters: ExceptionFilter[];
  interceptors: NestInterceptor[];
  microservices: MicroserviceOptions[];
  enableShutdownHooks: boolean;
}

export interface GatewayDynamicConfig {
  port: number;
  versioning: VersioningOptions;
  cors: CorsOptions;
}

export type GatewayConfigResolver = (
  app: NestExpressApplication,
) => GatewayDynamicConfig;

export async function bootstrapGateway(
  options: GatewayBootstrapOptions,
  configResolver: GatewayConfigResolver,
): Promise<INestApplication> {
  const {
    appModule,
    serviceName,
    globalPrefix,
    loggerOptions,
    middlewares,
    pipes,
    filters,
    interceptors,
    microservices,
    enableShutdownHooks,
  } = options;

  const app = await NestFactory.create<NestExpressApplication>(appModule, {
    logger: new ConsoleLogger(loggerOptions),
  });

  const { port, versioning, cors } = configResolver(app);

  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning(versioning);
  app.enableCors(cors);

  middlewares.forEach((m) => app.use(m));
  microservices.forEach((m) => app.connectMicroservice(m));

  app.useGlobalPipes(...pipes);
  app.useGlobalFilters(...filters);
  app.useGlobalInterceptors(...interceptors);

  if (enableShutdownHooks) {
    app.enableShutdownHooks();
  }

  if (microservices.length > 0) {
    await app.startAllMicroservices();
  }

  await app.listen(port);

  Logger.log(
    `🚀 ${serviceName} is running on: http://localhost:${port}/${globalPrefix}`,
    serviceName,
  );

  return app;
}
