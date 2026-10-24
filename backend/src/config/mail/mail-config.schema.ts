import Joi from 'joi';

export const mailConfigSchema = {
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().port().default(2525),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().default('Dalil Dimashq <noreply@dalil.local>'),
  MAIL_CAPTURE: Joi.boolean().default(false),
} as const;
