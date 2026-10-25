import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('staff hours override', () => {
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
    await clearRows(prisma);
  });

  it('saves Ramadan hours and booking windows without a review request', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-hours@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const week = Array.from({ length: 7 }, (_, dayOfWeek) => ({
      dayOfWeek,
      periods: dayOfWeek === 0 ? [{ opensAt: 600, closesAt: 900 }] : [],
    }));
    await request(app.getHttpServer())
      .put(`/admin-panel/places/${place.id}/hours`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ season: 'ramadan', week })
      .expect(200);
    const stored = await prisma.placeHour.findMany({ where: { placeId: place.id } });
    expect(stored).toEqual([
      expect.objectContaining({ season: 'ramadan', dayOfWeek: 0, opensAt: 600, closesAt: 900 }),
    ]);
    expect(await prisma.placeChangeRequest.count()).toBe(0);
    const reply = await request(app.getHttpServer())
      .post(`/admin-panel/places/${place.id}/response-hours`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ dayOfWeek: 1, opensAt: 540, closesAt: 1020 })
      .expect(201);
    expect(await prisma.bookingResponseHour.count({ where: { placeId: place.id } })).toBe(1);
    await request(app.getHttpServer())
      .delete(`/admin-panel/places/${place.id}/response-hours/${reply.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    const blackout = await request(app.getHttpServer())
      .post(`/admin-panel/places/${place.id}/blackouts`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ startsAt: '2026-11-01T00:00:00.000Z', endsAt: '2026-11-02T00:00:00.000Z' })
      .expect(201);
    expect(await prisma.bookingBlackout.count({ where: { id: blackout.body.id } })).toBe(1);
    expect(await prisma.subscription.count()).toBe(0);
  });
});

async function clearRows(prisma: PrismaProviderService): Promise<void> {
  await prisma.bookingResponseHour.deleteMany();
  await prisma.bookingBlackout.deleteMany();
  await prisma.placeHour.deleteMany();
  await prisma.placeChangeRequest.deleteMany();
  await prisma.place.deleteMany();
  await prisma.area.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
}
