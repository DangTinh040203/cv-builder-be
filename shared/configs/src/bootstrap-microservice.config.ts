import type {
  ConsoleLoggerOptions,
  ExceptionFilter,
  INestMicroservice,
  NestInterceptor,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions, Transport } from '@nestjs/microservices';
import type { ServiceName } from '@shared/constants/index';

export abstract class MicroserviceBootstrap {
  protected abstract readonly serviceName: ServiceName;
  protected abstract readonly appModule: Type<unknown>;
  protected abstract readonly transport: Transport;
  protected abstract readonly transportOptions: Record<string, unknown>;

  protected loggerOptions: ConsoleLoggerOptions = {};
  protected pipes: PipeTransform[] = [];
  protected filters: ExceptionFilter[] = [];
  protected interceptors: NestInterceptor[] = [];
  protected enableShutdownHooks = true;
  protected app: INestMicroservice | null = null;

  withValidation(): this {
    this.pipes.push(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    return this;
  }

  withPipes(...pipes: PipeTransform[]): this {
    this.pipes.push(...pipes);
    return this;
  }

  withFilters(...filters: ExceptionFilter[]): this {
    this.filters.push(...filters);
    return this;
  }

  withInterceptors(...interceptors: NestInterceptor[]): this {
    this.interceptors.push(...interceptors);
    return this;
  }

  withLogger(options: ConsoleLoggerOptions): this {
    this.loggerOptions = options;
    return this;
  }

  disableShutdownHooks(): this {
    this.enableShutdownHooks = false;
    return this;
  }

  getApp(): INestMicroservice {
    if (!this.app) {
      throw new Error('Microservice not started. Call start() first.');
    }
    return this.app;
  }

  async start(): Promise<INestMicroservice> {
    const microserviceOptions = {
      transport: this.transport,
      options: this.transportOptions,
    } as MicroserviceOptions;

    this.app = await NestFactory.createMicroservice<MicroserviceOptions>(
      this.appModule,
      {
        ...microserviceOptions,
        logger: new ConsoleLogger(this.loggerOptions),
      },
    );

    this.app.useGlobalPipes(...this.pipes);
    this.app.useGlobalFilters(...this.filters);
    this.app.useGlobalInterceptors(...this.interceptors);

    if (this.enableShutdownHooks) {
      this.app.enableShutdownHooks();
    }

    await this.app.listen();

    Logger.log(
      `🚀 ${this.serviceName} microservice is running`,
      this.serviceName,
    );

    return this.app;
  }

  async stop(): Promise<void> {
    if (this.app) {
      await this.app.close();
      Logger.log(
        `🛑 ${this.serviceName} microservice stopped`,
        this.serviceName,
      );
    }
  }
}
