process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('phone verification', () => {
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

  it('accepts only the fixed code and does not send SMS', async () => {
    const email = 'phone@example.com';
    await request(app.getHttpServer())
      .post('/client-app/auth/sign-up')
      .send({ email, password: 'Password123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/client-app/auth/verify-email')
      .send({ email, code: readCode() })
      .expect(200);
    const session = await request(app.getHttpServer())
      .post('/client-app/auth/sign-in')
      .send({ email, password: 'Password123' })
      .expect(200);
    const token = session.body.accessToken as string;
    await request(app.getHttpServer())
      .post('/client-app/profile/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Ahmad',
        lastName: 'Ali',
        phone: '0944333333',
        birthYear: 2000,
        language: 'ar',
      })
      .expect(200);
    const requested = await request(app.getHttpServer())
      .post('/client-app/profile/phone/code')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(requested.body.sent).toBe(false);
    const wrong = await request(app.getHttpServer())
      .post('/client-app/profile/phone/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: '123456' })
      .expect(400);
    expect(wrong.body.code).toBe('invalid_code');
    await request(app.getHttpServer())
      .post('/client-app/profile/phone/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: '000000' })
      .expect(200);
    const profile = await prisma.profile.findFirst({ where: { user: { email } } });
    expect(profile?.phoneVerifiedAt).not.toBeNull();
  });
});

function readCode(): string {
  const match = capturedMail[capturedMail.length - 1]?.text.match(/\d{6}/);
  if (!match) {
    throw new Error('missing code');
  }
  return match[0];
}
