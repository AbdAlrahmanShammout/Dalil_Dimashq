process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('visitor sign-up', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.user.deleteMany();
  });

  it('sends a code and rejects a wrong code the same way as a bad one', async () => {
    const email = 'visitor@example.com';
    const signUp = await request(app.getHttpServer())
      .post('/client-app/auth/sign-up')
      .send({ email, password: 'Password123' })
      .expect(201);
    expect(signUp.body).toEqual({ status: 'code_sent' });
    const wrong = await request(app.getHttpServer())
      .post('/client-app/auth/verify-email')
      .send({ email, code: '000000' })
      .expect(400);
    expect(wrong.body.code).toBe('invalid_code');
    await request(app.getHttpServer())
      .post('/client-app/auth/verify-email')
      .send({ email, code: readCode() })
      .expect(200);
  });
});

function readCode(): string {
  const match = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/);
  if (!match) {
    throw new Error('missing mail code');
  }
  return match[0];
}
