import Joi from 'joi';

export const firebaseConfigSchema = {
  FIREBASE_PROJECT_ID: Joi.string().allow('').default(''),
} as const;
