import { registerAs } from '@nestjs/config';

import { Environment } from '@/config/environment';

const DEFAULT_APP_PORT = 3000;
const DEFAULT_APP_NAME = 'dalil-dimashq-api';

export default [
  registerAs('app', () => ({
    env: process.env.APP_ENV ?? Environment.Local,
    port: Number(process.env.APP_PORT ?? DEFAULT_APP_PORT),
    name: process.env.APP_NAME ?? DEFAULT_APP_NAME,
  })),
];
