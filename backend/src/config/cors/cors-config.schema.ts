import Joi from 'joi';

export const corsConfigSchema = {
  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
} as const;
