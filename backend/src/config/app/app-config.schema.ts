import Joi from 'joi';

import { Environment } from '@/config/environment';

export const appConfigSchema = {
  APP_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Local),
  APP_PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('dalil-dimashq-api'),
} as const;
