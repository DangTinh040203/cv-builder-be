import { Env } from '@api-gateway/common/constants/env.constant';
import Joi from 'joi';

export const validationSchema = Joi.object({
  [Env.PORT]: Joi.number().required(),
  [Env.FRONTEND_ORIGIN]: Joi.string().required(),
  [Env.USER_SERVICE_HOST]: Joi.string().required(),
  [Env.USER_SERVICE_PORT]: Joi.number().required(),
  [Env.CLERK_WEBHOOK_SECRET]: Joi.string().required(),
});
