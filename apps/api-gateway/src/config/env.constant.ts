/**
 * Environment variable keys for API Gateway service.
 * Each service should have its own Env enum with only the variables it needs.
 */
export enum Env {
  // Server
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',

  // CORS
  FRONTEND_ORIGIN = 'FRONTEND_ORIGIN',

  // JWT (for token verification)
  JWT_SECRET = 'JWT_SECRET',

  // Redis (for caching/sessions)
  REDIS_URL = 'REDIS_URL',
}
