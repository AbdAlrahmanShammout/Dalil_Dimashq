import Joi from 'joi';

const MINIMUM_SECRET_LENGTH = 16;

export const jwtConfigSchema = {
  JWT_ACCESS_SECRET: Joi.string().min(MINIMUM_SECRET_LENGTH).required(),
  JWT_REFRESH_SECRET: Joi.string().min(MINIMUM_SECRET_LENGTH).required(),
  JWT_ACCESS_TTL_SECONDS: Joi.number().integer().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: Joi.number().integer().positive().default(2_592_000),
} as const;
