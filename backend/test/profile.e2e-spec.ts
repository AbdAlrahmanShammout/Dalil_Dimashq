process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('complete profile', () => {
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

  it('completes once, refuses a child, and refuses a taken phone', async () => {
    const email = 'profile@example.com';
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
    const young = await request(app.getHttpServer())
      .post('/client-app/profile/complete')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        firstName: 'Ahmad',
        lastName: 'Ali',
        phone: '0944000000',
        birthYear: 2015,
        language: 'ar',
      })
      .expect(400);
    expect(young.body.code).toBe('too_young');
    const completed = await request(app.getHttpServer())
      .post('/client-app/profile/complete')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        firstName: 'Ahmad',
        lastName: 'Ali',
        phone: '0944000000',
        birthYear: 2000,
        language: 'ar',
      })
      .expect(200);
    expect(completed.body.phone).toBe('+963944000000');
    const again = await request(app.getHttpServer())
      .post('/client-app/profile/complete')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        firstName: 'Ahmad',
        lastName: 'Ali',
        phone: '0944111111',
        birthYear: 2000,
        language: 'en',
      })
      .expect(409);
    expect(again.body.code).toBe('profile_already_complete');
    const updated = await request(app.getHttpServer())
      .patch('/client-app/profile')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({ phone: '0944111111', language: 'en' })
      .expect(200);
    expect(updated.body.phone).toBe('+963944111111');
    expect(updated.body.language).toBe('en');
    expect(updated.body.firstName).toBe('Ahmad');
    const stored = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    expect(stored?.profile?.phoneVerifiedAt).toBeNull();
    const change = await request(app.getHttpServer())
      .post('/client-app/profile/change-requests')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({ firstName: 'Sami', lastName: 'Nour' })
      .expect(201);
    expect(change.body.status).toBe('pending');
    const still = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    expect(still?.profile?.firstName).toBe('Ahmad');
    const pending = await request(app.getHttpServer())
      .post('/client-app/profile/change-requests')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({ birthYear: 1991 })
      .expect(409);
    expect(pending.body.code).toBe('request_pending');
  });
});

function readCode(): string {
  const match = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/);
  if (!match) {
    throw new Error('missing mail code');
  }
  return match[0];
}
