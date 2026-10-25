process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner hours', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeChangeRequest.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.placeHour.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.placeChangeRequest.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.placeHour.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('returns the regular week and leaves Ramadan rows out', async () => {
    const token = await signInOwner(app, 'owner-hours@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-hours@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    await prisma.placeHour.create({
      data: { placeId: place.id, dayOfWeek: 0, opensAt: 540, closesAt: 1020, season: 'regular' },
    });
    await prisma.placeHour.create({
      data: { placeId: place.id, dayOfWeek: 0, opensAt: 1080, closesAt: 1380, season: 'ramadan' },
    });
    const hours = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}/hours`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(hours.body.week).toHaveLength(7);
    expect(hours.body.week[0].dayOfWeek).toBe(0);
    expect(hours.body.week[0].periods).toEqual([{ opensAt: 540, closesAt: 1020 }]);
    expect(hours.body.ramadan).toBeUndefined();
  });

  it('saves hours for Premium and requests review otherwise', async () => {
    const token = await signInOwner(app, 'owner-save-hours@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-save-hours@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    await prisma.placeHour.create({
      data: { placeId: place.id, dayOfWeek: 0, opensAt: 540, closesAt: 1020, season: 'regular' },
    });
    await prisma.placeHour.create({
      data: { placeId: place.id, dayOfWeek: 0, opensAt: 1080, closesAt: 1380, season: 'ramadan' },
    });
    const week = Array.from({ length: 7 }, (_, dayOfWeek) => ({
      dayOfWeek,
      periods: [{ opensAt: 600, closesAt: 900 }],
    }));
    const requested = await request(app.getHttpServer())
      .put(`/dashboard-owner/places/${place.id}/hours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ week })
      .expect(200);
    expect(requested.body.result).toBe('requested');
    const unchanged = await prisma.placeHour.findMany({
      where: { placeId: place.id, season: 'regular' },
    });
    expect(unchanged).toEqual([expect.objectContaining({ opensAt: 540, closesAt: 1020 })]);
    await prisma.subscription.create({
      data: { placeId: place.id, endsAt: new Date('2027-01-01T00:00:00Z') },
    });
    const saved = await request(app.getHttpServer())
      .put(`/dashboard-owner/places/${place.id}/hours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ week })
      .expect(200);
    expect(saved.body.result).toBe('saved');
    const regular = await prisma.placeHour.findMany({
      where: { placeId: place.id, season: 'regular' },
    });
    expect(regular).toHaveLength(7);
    const ramadan = await prisma.placeHour.count({
      where: { placeId: place.id, season: 'ramadan' },
    });
    expect(ramadan).toBe(1);
  });
});

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
