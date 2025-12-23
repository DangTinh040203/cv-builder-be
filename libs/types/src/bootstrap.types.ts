import { type ServiceName } from '@libs/constants/index';
import type {
  ConsoleLoggerOptions,
  ExceptionFilter,
  NestInterceptor,
  PipeTransform,
  VersioningOptions,
} from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { MicroserviceOptions } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { RequestHandler } from 'express';

/**
 * Configuration options for bootstrapping a NestJS application.
 * All properties are required to ensure explicit configuration.
 */
export interface BootstrapOptions {
  /**
   * The root module of the application
   */
  appModule: new (...args: unknown[]) => unknown;

  /**
   * Service name for logging purposes
   */
  serviceName: ServiceName;

  /**
   * Global API prefix (e.g., 'api')
   */
  globalPrefix: string;

  /**
   * Console logger options
   */
  loggerOptions: ConsoleLoggerOptions;

  /**
   * Express middleware functions to apply (e.g., helmet, morgan, cookieParser)
   */
  middlewares: RequestHandler[];

  /**
   * Global pipes for validation/transformation
   */
  pipes: PipeTransform[];

  /**
   * Global exception filters
   */
  filters: ExceptionFilter[];

  /**
   * Global interceptors
   */
  interceptors: NestInterceptor[];

  /**
   * Microservice configurations to connect
   */
  microservices: MicroserviceOptions[];

  /**
   * Whether to enable shutdown hooks
   */
  enableShutdownHooks: boolean;
}

/**
 * Dynamic configuration resolved after app creation.
 * Used for values that depend on ConfigService (validated env vars).
 */
export interface DynamicConfig {
  /**
   * The port the application will listen on
   */
  port: number;

  /**
   * API versioning configuration
   */
  versioning: VersioningOptions;

  /**
   * CORS configuration
   */
  cors: CorsOptions;
}

/**
 * Configuration resolver function type.
 * Called after app is created with access to dependency injection.
 */
export type ConfigResolver = (app: NestExpressApplication) => DynamicConfig;
