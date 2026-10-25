process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('notification inbox', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lists the caller rows newest first', async () => {
    const email = 'inbox@example.com';
    await request(app.getHttpServer())
      .post('/client-app/auth/sign-up')
      .send({ email, password: 'Password123' })
      .expect(201);
    const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
    await request(app.getHttpServer())
      .post('/client-app/auth/verify-email')
      .send({ email, code })
      .expect(200);
    const session = await request(app.getHttpServer())
      .post('/client-app/auth/sign-in')
      .send({ email, password: 'Password123' })
      .expect(200);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await prisma.notification.create({
      data: {
        userId: user.id,
        kind: 'booking_confirmed',
        createdAt: new Date('2026-10-25T08:00:00Z'),
        readAt: new Date('2026-10-25T09:00:00Z'),
      },
    });
    await prisma.notification.create({
      data: {
        userId: user.id,
        kind: 'booking_expired',
        createdAt: new Date('2026-10-25T12:00:00Z'),
      },
    });
    const response = await request(app.getHttpServer())
      .get('/client-app/notifications')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(
      response.body.notifications.map((row: { kind: string; read: boolean }) => [
        row.kind,
        row.read,
      ]),
    ).toEqual([
      ['booking_expired', false],
      ['booking_confirmed', true],
    ]);
    const unread = response.body.notifications[0].id as string;
    const marked = await request(app.getHttpServer())
      .post(`/client-app/notifications/${unread}/read`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(201);
    expect(marked.body.readAt).toEqual(expect.any(String));
    const other = await prisma.user.create({
      data: { email: 'other-inbox@example.com', isVisitor: true },
    });
    const foreign = await prisma.notification.create({
      data: { userId: other.id, kind: 'booking_rejected' },
    });
    await request(app.getHttpServer())
      .post(`/client-app/notifications/${foreign.id}/read`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(404);
    const still = await prisma.notification.findUniqueOrThrow({ where: { id: foreign.id } });
    expect(still.readAt).toBeNull();
  });
});
