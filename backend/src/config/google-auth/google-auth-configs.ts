import { registerAs } from '@nestjs/config';

export default [
  registerAs('googleAuth', () => ({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
  })),
];
