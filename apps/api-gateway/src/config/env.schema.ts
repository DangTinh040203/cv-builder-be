import { Env } from '@api-gateway/config/env.constant';
import Joi from 'joi';

/**
 * Joi validation schema for API Gateway environment variables.
 * Validates all required env vars at application startup.
 */
export const envValidationSchema = Joi.object({
  [Env.PORT]: Joi.number().port().required().description('Server port'),

  [Env.NODE_ENV]: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Node environment'),

  [Env.FRONTEND_ORIGIN]: Joi.string()
    .uri()
    .required()
    .description('Frontend origin URL for CORS'),

  [Env.JWT_SECRET]: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key for token verification'),

  [Env.REDIS_URL]: Joi.string()
    .uri()
    .required()
    .description('Redis connection URL'),
});
