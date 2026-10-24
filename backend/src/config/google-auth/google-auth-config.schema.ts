import Joi from 'joi';

export const googleAuthConfigSchema = {
  GOOGLE_OAUTH_CLIENT_ID: Joi.string().allow('').default(''),
} as const;
