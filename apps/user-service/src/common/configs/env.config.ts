import Joi from 'joi';

export const validationSchema = Joi.object({
  TCP_HOST: Joi.string().required(),
  TCP_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  DATABASE_URL: Joi.string().required(),
});
