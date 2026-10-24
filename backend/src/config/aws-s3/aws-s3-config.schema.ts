import Joi from 'joi';

export const awsS3ConfigSchema = {
  AWS_REGION: Joi.string().allow('').default(''),
  AWS_S3_BUCKET: Joi.string().allow('').default(''),
  AWS_ACCESS_KEY_ID: Joi.string().allow('').default(''),
  AWS_SECRET_ACCESS_KEY: Joi.string().allow('').default(''),
  AWS_S3_READ_TTL_SECONDS: Joi.number().integer().positive().default(900),
} as const;
