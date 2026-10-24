import Joi from 'joi';

export const databaseConfigSchema = {
  DATABASE_URL: Joi.string()
    .pattern(/^postgres(ql)?:\/\//)
    .required(),
} as const;
