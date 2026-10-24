import { registerAs } from '@nestjs/config';

const DEFAULT_MAIL_PORT = 2525;
const DEFAULT_MAIL_FROM = 'Dalil Dimashq <noreply@dalil.local>';

export default [
  registerAs('mail', () => ({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? DEFAULT_MAIL_PORT),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    fromAddress: process.env.MAIL_FROM ?? DEFAULT_MAIL_FROM,
    capture: process.env.MAIL_CAPTURE === 'true',
  })),
];
