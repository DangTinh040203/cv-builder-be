import type { INestApplication } from '@nestjs/common';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { BootstrapOptions, ConfigResolver } from '@shared/types/index';

/**
 * Bootstrap a NestJS application with the provided configuration.
 * Uses a config resolver to get dynamic values (port, cors) after app creation.
 */
export async function bootstrapApplication(
  options: BootstrapOptions,
  configResolver: ConfigResolver,
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

  // Get dynamic config from resolver (has access to ConfigService)
  const { port, versioning, cors } = configResolver(app);

  // Configure global prefix
  app.setGlobalPrefix(globalPrefix);

  // Configure versioning
  app.enableVersioning(versioning);

  // Configure CORS
  app.enableCors(cors);

  // Apply Express middlewares
  for (const middleware of middlewares) {
    app.use(middleware);
  }

  // Apply global pipes
  for (const pipe of pipes) {
    app.useGlobalPipes(pipe);
  }

  // Apply global filters
  for (const filter of filters) {
    app.useGlobalFilters(filter);
  }

  // Apply global interceptors
  for (const interceptor of interceptors) {
    app.useGlobalInterceptors(interceptor);
  }

  // Configure microservices
  for (const microserviceConfig of microservices) {
    app.connectMicroservice(microserviceConfig);
  }

  // Enable shutdown hooks if requested
  if (enableShutdownHooks) {
    app.enableShutdownHooks();
  }

  // Start microservices if any configured
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
