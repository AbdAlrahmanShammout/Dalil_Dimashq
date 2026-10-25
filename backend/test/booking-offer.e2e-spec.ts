process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('booking offer link', () => {
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
    await prisma.offer.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.booking.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores a current offer and leaves the offer unchanged', async () => {
    const email = 'offer-book@example.com';
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
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        bookingSettings: { create: { acceptsBookings: true } },
        hours: { create: { dayOfWeek: 0, opensAt: 0, closesAt: 24 * 60 } },
      },
    });
    const offer = await prisma.offer.create({
      data: {
        placeId: place.id,
        titleAr: 'عرض',
        titleEn: 'Deal',
        detailsAr: 'تفاصيل',
        detailsEn: 'Details',
        startsAt: new Date('2026-10-01T00:00:00Z'),
        endsAt: new Date('2026-12-01T00:00:00Z'),
        published: true,
      },
    });
    const created = await request(app.getHttpServer())
      .post('/client-app/bookings')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({
        clientKey: 'offer-key',
        placeId: place.id,
        startsAt: '2026-11-01T12:00:00.000Z',
        partySize: 2,
        offerId: offer.id,
      })
      .expect(201);
    const stored = await prisma.booking.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(stored.offerId).toBe(offer.id);
    const still = await prisma.offer.findUniqueOrThrow({ where: { id: offer.id } });
    expect(still.endsAt.toISOString()).toBe('2026-12-01T00:00:00.000Z');
  });
});
