import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('ramadan hours', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.ramadanSeason.deleteMany();
    await prisma.placeHour.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.ramadanSeason.deleteMany();
    await prisma.placeHour.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
  });

  it('keeps Ramadan hours out until a stored season contains now', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    await prisma.placeHour.create({
      data: { placeId: place.id, dayOfWeek: 0, opensAt: 540, closesAt: 1020, season: 'regular' },
    });
    await prisma.placeHour.create({
      data: { placeId: place.id, dayOfWeek: 0, opensAt: 1080, closesAt: 1380, season: 'ramadan' },
    });
    await prisma.ramadanSeason.create({
      data: {
        startsAt: new Date('2026-02-17T00:00:00Z'),
        endsAt: new Date('2026-03-19T00:00:00Z'),
      },
    });
    const outside = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}/hours`)
      .expect(200);
    expect(outside.body.ramadan).toBeNull();
    expect(outside.body.week[0].periods).toEqual([{ opensAt: 540, closesAt: 1020 }]);
    await prisma.ramadanSeason.create({
      data: {
        startsAt: new Date('2026-10-01T00:00:00Z'),
        endsAt: new Date('2026-11-01T00:00:00Z'),
      },
    });
    const inside = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}/hours`)
      .expect(200);
    expect(inside.body.week[0].periods).toEqual([{ opensAt: 540, closesAt: 1020 }]);
    expect(inside.body.ramadan[0].periods).toEqual([{ opensAt: 1080, closesAt: 1380 }]);
  });
});
