process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('my bookings', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('counts every status for the caller', async () => {
    const email = 'mine@example.com';
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
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    await prisma.booking.create({
      data: {
        clientKey: 'a',
        userId: user.id,
        placeId: place.id,
        startsAt: new Date('2026-11-01T12:00:00Z'),
        partySize: 2,
        status: 'pending',
      },
    });
    await prisma.booking.create({
      data: {
        clientKey: 'b',
        userId: user.id,
        placeId: place.id,
        startsAt: new Date('2026-11-02T12:00:00Z'),
        partySize: 2,
        status: 'attended',
      },
    });
    const other = await prisma.user.create({
      data: { email: 'other@example.com', isVisitor: true },
    });
    await prisma.booking.create({
      data: {
        clientKey: 'c',
        userId: other.id,
        placeId: place.id,
        startsAt: new Date('2026-11-03T12:00:00Z'),
        partySize: 1,
        status: 'confirmed',
      },
    });
    const response = await request(app.getHttpServer())
      .get('/client-app/bookings')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(response.body.total).toBe(2);
    expect(response.body.bookings).toHaveLength(2);
    expect(response.body.bookings.map((row: { status: string }) => row.status).sort()).toEqual([
      'attended',
      'pending',
    ]);
  });

  it('returns the owner detail and hides another visitor', async () => {
    const email = 'detail@example.com';
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
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const booking = await prisma.booking.create({
      data: {
        clientKey: 'detail',
        userId: user.id,
        placeId: place.id,
        startsAt: new Date('2026-11-01T12:00:00Z'),
        partySize: 3,
        note: 'Window',
        rejectionReason: 'Full',
        status: 'rejected',
      },
    });
    const other = await prisma.user.create({
      data: { email: 'detail-other@example.com', isVisitor: true },
    });
    const foreign = await prisma.booking.create({
      data: {
        clientKey: 'foreign',
        userId: other.id,
        placeId: place.id,
        startsAt: new Date('2026-11-01T12:00:00Z'),
        partySize: 1,
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/client-app/bookings/${booking.id}`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(response.body).toMatchObject({
      partySize: 3,
      note: 'Window',
      rejectionReason: 'Full',
      place: { id: place.id, nameAr: 'مقهى', nameEn: 'Cafe' },
    });
    await request(app.getHttpServer())
      .get(`/client-app/bookings/${foreign.id}`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(404);
  });
});
