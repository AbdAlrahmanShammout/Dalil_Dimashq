process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bcrypt from 'bcrypt';
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

  it('signs in after confirmation and rotates the refresh token', async () => {
    const email = 'session@example.com';
    await request(app.getHttpServer())
      .post('/client-app/auth/sign-up')
      .send({ email, password: 'Password123' })
      .expect(201);
    const pending = await request(app.getHttpServer())
      .post('/client-app/auth/sign-in')
      .send({ email, password: 'Password123' })
      .expect(401);
    expect(pending.body.code).toBe('email_not_confirmed');
    await request(app.getHttpServer())
      .post('/client-app/auth/verify-email')
      .send({ email, code: readCode() })
      .expect(200);
    const session = await request(app.getHttpServer())
      .post('/client-app/auth/sign-in')
      .send({ email, password: 'Password123' })
      .expect(200);
    expect(readAudience(session.body.accessToken)).toBe('client-app');
    await request(app.getHttpServer())
      .post('/client-app/auth/refresh')
      .send({ refreshToken: session.body.refreshToken })
      .expect(200);
    await request(app.getHttpServer())
      .post('/client-app/auth/refresh')
      .send({ refreshToken: session.body.refreshToken })
      .expect(401);
  });

  it('rejects an owner who never opened the visitor door', async () => {
    await prisma.user.create({
      data: {
        email: 'owner-only@example.com',
        passwordHash: await bcrypt.hash('Password123', 10),
        isOwner: true,
        isVisitor: false,
        emailVerifiedAt: new Date(),
        profile: { create: {} },
      },
    });
    const response = await request(app.getHttpServer())
      .post('/client-app/auth/sign-in')
      .send({ email: 'owner-only@example.com', password: 'Password123' })
      .expect(401);
    expect(response.body.code).toBe('invalid_credentials');
  });
});

function readAudience(accessToken: string): string {
  const payload = JSON.parse(
    Buffer.from(accessToken.split('.')[1], 'base64url').toString('utf8'),
  ) as { aud: string };
  return payload.aud;
}

function readCode(): string {
  const match = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/);
  if (!match) {
    throw new Error('missing mail code');
  }
  return match[0];
}
