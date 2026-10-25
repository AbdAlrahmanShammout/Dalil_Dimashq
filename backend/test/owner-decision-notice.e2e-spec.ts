process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NotificationKind } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';
import { NotificationRepository } from '@/modules/notification/repository/notification.repository';

describe('owner decision notices', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await clearRows(prisma);
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await clearRows(prisma);
  });

  it('writes the inbox row in the same transaction as the decision', async () => {
    const token = await signInOwner(app, 'owner-notice@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-notice@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: owner.id } });
    const visitor = await prisma.user.create({
      data: { email: 'guest-notice@example.com', passwordHash: 'hash', isVisitor: true },
    });
    const pending = await createBooking(prisma, visitor.id, place.id, 'confirm', 'pending');
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/bookings/${pending.id}/confirm`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    await expectNotice(prisma, visitor.id, 'booking_confirmed', pending.id);
    const rejected = await createBooking(prisma, visitor.id, place.id, 'reject', 'pending');
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/bookings/${rejected.id}/reject`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Full' })
      .expect(201);
    await expectNotice(prisma, visitor.id, 'booking_rejected', rejected.id);
    const cancelled = await createBooking(prisma, visitor.id, place.id, 'cancel', 'confirmed');
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/bookings/${cancelled.id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Kitchen closed' })
      .expect(201);
    await expectNotice(prisma, visitor.id, 'booking_cancelled_by_owner', cancelled.id);
    const reported = await createBooking(prisma, visitor.id, place.id, 'fake', 'confirmed');
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/bookings/${reported.id}/fake-report`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Never came' })
      .expect(201);
    await expectNotice(prisma, visitor.id, 'fake_reported', reported.id);
    await expectNotice(prisma, owner.id, 'fake_report_new', reported.id);
    const attended = await createBooking(
      prisma,
      visitor.id,
      place.id,
      'attend',
      'confirmed',
      new Date(),
    );
    const before = await prisma.notification.count();
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/bookings/${attended.id}/attendance`)
      .set('Authorization', `Bearer ${token}`)
      .send({ result: 'attended' })
      .expect(201);
    expect(await prisma.notification.count()).toBe(before);
    const rollback = await createBooking(prisma, visitor.id, place.id, 'rollback', 'pending');
    const repository = app.get(NotificationRepository);
    const original = repository.record.bind(repository);
    repository.record = () => Promise.reject(new Error('inbox failed'));
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/bookings/${rollback.id}/confirm`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500);
    repository.record = original;
    const stored = await prisma.booking.findUniqueOrThrow({ where: { id: rollback.id } });
    expect(stored.status).toBe('pending');
    expect(await prisma.notification.count({ where: { bookingId: rollback.id } })).toBe(0);
  });
});

async function createBooking(
  prisma: PrismaProviderService,
  userId: string,
  placeId: string,
  clientKey: string,
  status: 'pending' | 'confirmed',
  startsAt: Date = new Date('2026-12-20T18:00:00Z'),
): Promise<{ id: string }> {
  return prisma.booking.create({
    data: { clientKey, userId, placeId, startsAt, partySize: 2, status },
  });
}

async function expectNotice(
  prisma: PrismaProviderService,
  userId: string,
  kind: NotificationKind,
  bookingId: string,
): Promise<void> {
  const row = await prisma.notification.findFirst({ where: { userId, kind, bookingId } });
  expect(row).not.toBeNull();
}

async function clearRows(prisma: PrismaProviderService): Promise<void> {
  await prisma.notification.deleteMany();
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
