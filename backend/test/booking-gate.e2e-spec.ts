process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('booking gate', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.bookingBan.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.bookingBan.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('requires an open place and no active ban', async () => {
    const email = 'booker@example.com';
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
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const closed = await prisma.place.create({
      data: { nameAr: 'مغلق', nameEn: 'Closed', type: 'cafe', status: 'active', areaId: area.id },
    });
    const closedResponse = await request(app.getHttpServer())
      .post('/client-app/bookings')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        placeId: closed.id,
        clientKey: 'key-1',
        startsAt: '2026-11-01T18:00:00.000Z',
        partySize: 2,
      })
      .expect(400);
    expect(closedResponse.body.code).toBe('booking_closed');
    const open = await prisma.place.create({
      data: {
        nameAr: 'مفتوح',
        nameEn: 'Open',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        bookingSettings: { create: { acceptsBookings: true } },
      },
    });
    const allowed = await request(app.getHttpServer())
      .post('/client-app/bookings')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        placeId: open.id,
        clientKey: 'key-1',
        startsAt: '2026-11-01T18:00:00.000Z',
        partySize: 2,
      })
      .expect(201);
    expect(allowed.body.id).toEqual(expect.any(String));
    const repeat = await request(app.getHttpServer())
      .post('/client-app/bookings')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        placeId: open.id,
        clientKey: 'key-1',
        startsAt: '2026-11-02T18:00:00.000Z',
        partySize: 3,
      })
      .expect(201);
    expect(repeat.body.id).toBe(allowed.body.id);
    expect(await prisma.booking.count()).toBe(1);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await prisma.bookingBan.create({
      data: {
        userId: user.id,
        level: 1,
        startsAt: new Date('2026-01-01T00:00:00Z'),
        endsAt: new Date('2027-01-01T00:00:00Z'),
      },
    });
    const banned = await request(app.getHttpServer())
      .post('/client-app/bookings')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        placeId: open.id,
        clientKey: 'key-2',
        startsAt: '2026-11-01T18:00:00.000Z',
        partySize: 2,
      })
      .expect(403);
    expect(banned.body.code).toBe('booking_banned');
    await request(app.getHttpServer())
      .post('/client-app/bookings')
      .send({ placeId: open.id })
      .expect(401);
  });
});
