import { registerAs } from '@nestjs/config';

const DEFAULT_READ_TTL_SECONDS = 900;

export default [
  registerAs('awsS3', () => ({
    region: process.env.AWS_REGION ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    readTtlSeconds: Number(process.env.AWS_S3_READ_TTL_SECONDS ?? DEFAULT_READ_TTL_SECONDS),
  })),
];
