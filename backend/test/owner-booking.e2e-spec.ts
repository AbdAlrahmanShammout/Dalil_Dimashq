process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner place bookings', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await clearBookings(prisma);
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await clearBookings(prisma);
  });

  it('returns the visitor name, phone, party, time, note, status, and report flag', async () => {
    const token = await signInOwner(app, 'owner-book@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-book@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: owner.id } });
    const visitor = await prisma.user.create({
      data: {
        email: 'guest-book@example.com',
        passwordHash: 'hash',
        isVisitor: true,
        emailVerifiedAt: new Date('2026-01-01T00:00:00Z'),
        profile: { create: { firstName: 'Sara', lastName: 'Ali', phone: '0999000111' } },
      },
    });
    const startsAt = new Date('2026-12-01T18:00:00Z');
    const booking = await prisma.booking.create({
      data: {
        clientKey: 'key-1',
        userId: visitor.id,
        placeId: place.id,
        startsAt,
        partySize: 3,
        note: 'window',
        status: 'pending',
      },
    });
    await prisma.fakeReport.create({
      data: {
        userId: visitor.id,
        placeId: place.id,
        bookingId: booking.id,
        message: 'Did not come',
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}/bookings`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.items).toEqual([
      {
        id: booking.id,
        name: 'Sara Ali',
        phone: '0999000111',
        partySize: 3,
        startsAt: startsAt.toISOString(),
        note: 'window',
        status: 'pending',
        reported: true,
      },
    ]);
  });
});

async function clearBookings(prisma: PrismaProviderService): Promise<void> {
  await prisma.fakeReport.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.placeOwner.deleteMany();
  await prisma.place.deleteMany();
  await prisma.area.deleteMany();
  await prisma.user.deleteMany();
}

async function signInOwner(app: INestApplication, email: string): Promise<string> {
  await request(app.getHttpServer())
    .post('/dashboard-owner/auth/sign-up')
    .send({ email, password: 'Password123' })
    .expect(201);
  const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
  await request(app.getHttpServer())
    .post('/dashboard-owner/auth/verify-email')
    .send({ email, code })
    .expect(200);
  const session = await request(app.getHttpServer())
    .post('/dashboard-owner/auth/sign-in')
    .send({ email, password: 'Password123' })
    .expect(200);
  return session.body.accessToken as string;
}
