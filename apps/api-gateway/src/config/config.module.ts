import { envValidationSchema } from '@api-gateway/config/env.schema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * Configuration module for API Gateway.
 * Loads and validates environment variables using Joi schema.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
  ],
})
export class AppConfigModule {}
