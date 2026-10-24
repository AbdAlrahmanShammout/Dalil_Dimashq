import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import Joi from 'joi';

import { appConfigSchema } from '@/config/app/app-config.schema';
import { corsConfigSchema } from '@/config/cors/cors-config.schema';
import { databaseConfigSchema } from '@/config/database/database-config.schema';
import { jwtConfigSchema } from '@/config/jwt/jwt-config.schema';
import { swaggerConfigSchema } from '@/config/swagger/swagger-config.schema';

const validationSchema = Joi.object({
  ...appConfigSchema,
  ...databaseConfigSchema,
  ...jwtConfigSchema,
  ...swaggerConfigSchema,
  ...corsConfigSchema,
});

function readDotenvKeys(): Record<string, string> {
  const filePath = resolve(process.cwd(), '.env');
  if (!existsSync(filePath)) {
    return {};
  }
  const parsed: Record<string, string> = {};
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    parsed[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1);
  }
  return parsed;
}

/**
 * Rejects unknown keys in `.env`, and still accepts operating-system variables
 * such as `PATH` on the process environment. Required secrets stay required.
 */
export function validateEnvironment(
  config: Record<string, unknown>,
  dotenvKeys: Record<string, unknown> = readDotenvKeys(),
): Record<string, unknown> {
  const allowedKeys = new Set(Object.keys(validationSchema.describe().keys));
  const unknownKeys = Object.keys(dotenvKeys).filter((key) => !allowedKeys.has(key));
  if (unknownKeys.length > 0) {
    throw new Error(`Config validation error: "${unknownKeys.join('", "')}" is not allowed`);
  }
  const environmentResult = validationSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (environmentResult.error) {
    throw new Error(`Config validation error: ${environmentResult.error.message}`);
  }
  const validated = environmentResult.value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(validated).filter(([key]) => allowedKeys.has(key)));
}
