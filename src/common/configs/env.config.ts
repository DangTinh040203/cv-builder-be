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
});

export const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
