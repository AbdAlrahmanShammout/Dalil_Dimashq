import Joi from 'joi';

export const googleMapsConfigSchema = {
  GOOGLE_MAPS_API_KEY: Joi.string().allow('').default(''),
} as const;
