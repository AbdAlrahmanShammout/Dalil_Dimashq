import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('place summary', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
  });

  it('returns the public summary and omits a hidden place', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        addressAr: 'شارع',
        addressEn: 'Street',
        latitude: 33.51,
        longitude: 36.27,
        isFeatured: true,
        starValue: 4,
        starSource: 'tourism',
        phone: '+963944000000',
      },
    });
    const hidden = await prisma.place.create({
      data: {
        nameAr: 'مخفي',
        nameEn: 'Hidden',
        type: 'hotel',
        status: 'hidden',
        areaId: area.id,
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}`)
      .expect(200);
    expect(response.body).toMatchObject({
      id: place.id,
      nameAr: 'مقهى',
      nameEn: 'Cafe',
      type: 'cafe',
      status: 'active',
      featured: true,
      starLabel: 4,
      starSource: 'tourism',
      photoFallback: 'cafe',
      latitude: 33.51,
      longitude: 36.27,
      phone: '+963944000000',
    });
    expect(response.body.website).toBeUndefined();
    expect(response.body.email).toBeUndefined();
    expect(response.body.area).toEqual({ id: area.id, nameAr: 'المزة', nameEn: 'Mazzeh' });
    expect(response.body.hidden).toBeUndefined();
    await request(app.getHttpServer()).get(`/client-app/places/${hidden.id}`).expect(404);
    const counts = await request(app.getHttpServer()).get('/client-app/places/counts').expect(200);
    expect(counts.body).toEqual({ all: 1, hotels: 0, restaurants: 0, cafes: 1 });
  });

  it('filters search and returns the real total', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    await prisma.place.create({
      data: {
        nameAr: 'مقهى النور',
        nameEn: 'Light Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        phone: '+963944000001',
        starValue: 5,
        addressEn: 'Light street',
      },
    });
    await prisma.place.create({
      data: {
        nameAr: 'مطعم',
        nameEn: 'Table',
        type: 'restaurant',
        status: 'active',
        areaId: area.id,
        starValue: 2,
      },
    });
    const response = await request(app.getHttpServer())
      .get('/client-app/places')
      .query({ text: 'Light', type: 'cafe', areaId: area.id, minimumStars: 4, hasPhone: true })
      .expect(200);
    expect(response.body.total).toBe(1);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].nameEn).toBe('Light Cafe');
    const byName = await request(app.getHttpServer())
      .get('/client-app/places')
      .query({ sort: 'name' })
      .expect(200);
    expect(byName.body.total).toBe(2);
    expect(byName.body.items.map((item: { nameEn: string }) => item.nameEn)).toEqual([
      'Light Cafe',
      'Table',
    ]);
  });
});
