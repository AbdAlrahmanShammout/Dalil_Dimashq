import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('offers', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.offer.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.offer.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
  });

  it('lists current offers on the banner and on the place', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const now = new Date();
    await prisma.offer.create({
      data: {
        placeId: place.id,
        titleAr: 'عرض',
        titleEn: 'Deal',
        detailsAr: 'تفاصيل',
        detailsEn: 'Details',
        startsAt: new Date(now.getTime() - 60_000),
        endsAt: new Date(now.getTime() + 86_400_000),
      },
    });
    await prisma.offer.create({
      data: {
        placeId: place.id,
        titleAr: 'قديم',
        titleEn: 'Old',
        detailsAr: 'انتهى',
        detailsEn: 'Ended',
        startsAt: new Date(now.getTime() - 172_800_000),
        endsAt: new Date(now.getTime() - 60_000),
      },
    });
    const banner = await request(app.getHttpServer()).get('/client-app/offers').expect(200);
    expect(banner.body.total).toBe(1);
    expect(banner.body.items[0].titleEn).toBe('Deal');
    expect(banner.body.items[0].imageUrl).toBeNull();
    expect(banner.body.items[0].until).toEqual(expect.any(String));
    const placeOffers = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}/offers`)
      .expect(200);
    expect(placeOffers.body.total).toBe(1);
  });
});
