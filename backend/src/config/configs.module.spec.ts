import Joi from 'joi';

import { appConfigSchema } from '@/config/app/app-config.schema';
import { corsConfigSchema } from '@/config/cors/cors-config.schema';
import { databaseConfigSchema } from '@/config/database/database-config.schema';
import { jwtConfigSchema } from '@/config/jwt/jwt-config.schema';
import { swaggerConfigSchema } from '@/config/swagger/swagger-config.schema';

const schema = Joi.object({
  ...appConfigSchema,
  ...databaseConfigSchema,
  ...jwtConfigSchema,
  ...swaggerConfigSchema,
  ...corsConfigSchema,
});

const validEnvironment = {
  DATABASE_URL: 'postgresql://dalil:dalil@localhost:5432/dalil',
  JWT_ACCESS_SECRET: 'access-secret-value',
  JWT_REFRESH_SECRET: 'refresh-secret-value',
};

describe('configuration schema', () => {
  it('accepts the required secrets and applies defaults', () => {
    const { error, value } = schema.validate(validEnvironment, {
      abortEarly: false,
      allowUnknown: false,
    });
    expect(error).toBeUndefined();
    expect(value.APP_PORT).toBe(3000);
    expect(value.SWAGGER_ENABLED).toBe(false);
  });

  it('rejects an unknown variable', () => {
    const { error } = schema.validate(
      { ...validEnvironment, EXTRA_FLAG: '1' },
      { abortEarly: false, allowUnknown: false },
    );
    expect(error).toBeDefined();
  });

  it('rejects a missing database url', () => {
    const { error } = schema.validate(
      { JWT_ACCESS_SECRET: 'access-secret-value', JWT_REFRESH_SECRET: 'refresh-secret-value' },
      { abortEarly: false, allowUnknown: false },
    );
    expect(error).toBeDefined();
  });
});
