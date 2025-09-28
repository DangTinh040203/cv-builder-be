import Joi from 'joi';

import { Env } from '@/common/constants/env.constant';

export const validationSchema = Joi.object({
  [Env.PORT]: Joi.number().required(),
  [Env.MONGO_CONNECTION_STRING]: Joi.string().uri().required(),
  [Env.REDIS_CONNECTION_STRING]: Joi.string().uri().required(),
});

export const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
