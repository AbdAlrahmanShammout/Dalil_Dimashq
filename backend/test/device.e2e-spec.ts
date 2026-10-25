process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

async function signIn(app: INestApplication, path: string, email: string): Promise<string> {
  clearCapturedMail();
  await request(app.getHttpServer())
    .post(`${path}/sign-up`)
    .send({ email, password: 'Password123' })
    .expect(201);
  const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
  await request(app.getHttpServer()).post(`${path}/verify-email`).send({ email, code }).expect(200);
  const session = await request(app.getHttpServer())
    .post(`${path}/sign-in`)
    .send({ email, password: 'Password123' })
    .expect(200);
  return session.body.accessToken as string;
}

describe('device registration', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.device.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.device.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores a visitor token and an owner token without sending a push', async () => {
    const visitor = await signIn(app, '/client-app/auth', 'visitor-device@example.com');
    const owner = await signIn(app, '/dashboard-owner/auth', 'owner-device@example.com');
    await request(app.getHttpServer())
      .post('/client-app/devices')
      .set('Authorization', `Bearer ${visitor}`)
      .send({ platform: 'android', token: 'visitor-token' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/dashboard-owner/devices')
      .set('Authorization', `Bearer ${owner}`)
      .send({ platform: 'ios', token: 'owner-token' })
      .expect(201);
    expect(await prisma.device.count()).toBe(2);
    expect(await prisma.notification.count()).toBe(0);
  });
});
