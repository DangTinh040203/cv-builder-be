import Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  FRONTEND_ORIGIN: Joi.string().required(),
  USER_SERVICE_HOST: Joi.string().required(),
  USER_SERVICE_PORT: Joi.number().required(),
});
