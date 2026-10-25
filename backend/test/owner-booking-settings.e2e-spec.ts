process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner booking settings', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await clearSettings(prisma);
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await clearSettings(prisma);
  });

  it('keeps the stored notice when the update sends null', async () => {
    const token = await signInOwner(app, 'owner-settings@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-settings@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: owner.id } });
    const initial = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}/booking-settings`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(initial.body).toEqual({ acceptsBookings: false, maxParty: 8, noticeMinutes: 60 });
    await request(app.getHttpServer())
      .put(`/dashboard-owner/places/${place.id}/booking-settings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ acceptsBookings: true, maxParty: 4, noticeMinutes: 90 })
      .expect(200);
    const kept = await request(app.getHttpServer())
      .put(`/dashboard-owner/places/${place.id}/booking-settings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ acceptsBookings: true, maxParty: 6, noticeMinutes: null })
      .expect(200);
    expect(kept.body).toEqual({ acceptsBookings: true, maxParty: 6, noticeMinutes: 90 });
  });

  it('writes a reply window only for Premium and does not open a review', async () => {
    const token = await signInOwner(app, 'owner-hours@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-hours@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: owner.id } });
    const blocked = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/response-hours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ dayOfWeek: 1, opensAt: 600, closesAt: 900 })
      .expect(403);
    expect(blocked.body.code).toBe('premium_required');
    await prisma.subscription.create({
      data: { placeId: place.id, endsAt: new Date('2027-01-01T00:00:00Z') },
    });
    const created = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/response-hours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ dayOfWeek: 1, opensAt: 600, closesAt: 900 })
      .expect(201);
    expect(await prisma.bookingResponseHour.count()).toBe(1);
    expect(await prisma.placeChangeRequest.count()).toBe(0);
    await request(app.getHttpServer())
      .delete(`/dashboard-owner/places/${place.id}/response-hours/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(await prisma.bookingResponseHour.count()).toBe(0);
  });

  it('writes a closed range only for Premium and does not open a review', async () => {
    const token = await signInOwner(app, 'owner-blackout@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-blackout@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: owner.id } });
    const blocked = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/blackouts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ startsAt: '2026-12-01T00:00:00.000Z', endsAt: '2026-12-03T00:00:00.000Z' })
      .expect(403);
    expect(blocked.body.code).toBe('premium_required');
    await prisma.subscription.create({
      data: { placeId: place.id, endsAt: new Date('2027-01-01T00:00:00Z') },
    });
    const created = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/blackouts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ startsAt: '2026-12-01T00:00:00.000Z', endsAt: '2026-12-03T00:00:00.000Z' })
      .expect(201);
    expect(await prisma.bookingBlackout.count()).toBe(1);
    expect(await prisma.placeChangeRequest.count()).toBe(0);
    await request(app.getHttpServer())
      .delete(`/dashboard-owner/places/${place.id}/blackouts/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(await prisma.bookingBlackout.count()).toBe(0);
  });
});

async function clearSettings(prisma: PrismaProviderService): Promise<void> {
  await prisma.subscription.deleteMany();
  await prisma.bookingResponseHour.deleteMany();
  await prisma.bookingBlackout.deleteMany();
  await prisma.placeBookingSettings.deleteMany();
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
