import { registerAs } from '@nestjs/config';

const DEFAULT_CORS_ORIGINS = 'http://localhost:3000';

export default [
  registerAs('cors', () => ({
    origins: (process.env.CORS_ORIGINS ?? DEFAULT_CORS_ORIGINS)
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  })),
];
