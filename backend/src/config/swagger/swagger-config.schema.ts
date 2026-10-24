import Joi from 'joi';

export const swaggerConfigSchema = {
  SWAGGER_ENABLED: Joi.boolean().truthy('true').falsy('false').default(false),
} as const;
