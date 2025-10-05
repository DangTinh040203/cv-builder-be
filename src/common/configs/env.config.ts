import Joi from 'joi';

import { Env } from '@/common/constants/env.constant';

export const validationSchema = Joi.object({
  [Env.PORT]: Joi.number().required(),
  [Env.MONGO_CONNECTION_STRING]: Joi.string().uri().required(),
  [Env.REDIS_CONNECTION_STRING]: Joi.string().uri().required(),

  [Env.EMAIL_HOST]: Joi.string().required(),
  [Env.EMAIL_PORT]: Joi.number().required(),
  [Env.EMAIL_USERNAME]: Joi.string().required(),
  [Env.EMAIL_PASSWORD]: Joi.string().required(),

  [Env.JWT_SECRET]: Joi.string().required(),
  [Env.JWT_EXPIRES_IN]: Joi.string().required(),

  [Env.JWT_REFRESH_SECRET]: Joi.string().required(),
  [Env.JWT_REFRESH_EXPIRES_IN]: Joi.string().required(),

  [Env.AWS_ACCESS_KEY]: Joi.string().required(),
  [Env.AWS_SECRET_KEY]: Joi.string().required(),
  [Env.AWS_REGION]: Joi.string().required(),
  [Env.AWS_BUCKET_NAME]: Joi.string().required(),
  [Env.CLOUDFRONT_URL]: Joi.string().uri().required(),

  [Env.DEFAULT_USER_AVATAR]: Joi.string().uri().required(),
});

export const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
