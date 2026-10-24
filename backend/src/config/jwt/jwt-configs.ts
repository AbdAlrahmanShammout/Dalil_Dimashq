import { registerAs } from '@nestjs/config';

const DEFAULT_ACCESS_TTL_SECONDS = 900;
const DEFAULT_REFRESH_TTL_SECONDS = 2_592_000;

export default [
  registerAs('jwt', () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? DEFAULT_ACCESS_TTL_SECONDS),
    refreshTtlSeconds: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? DEFAULT_REFRESH_TTL_SECONDS),
  })),
];
