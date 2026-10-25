import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('events', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.event.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.event.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
  });

  it('lists published events and returns the linked place', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'قاعة', nameEn: 'Hall', type: 'cafe', status: 'active', areaId: area.id },
    });
    const event = await prisma.event.create({
      data: {
        placeId: place.id,
        titleAr: 'ليلة',
        titleEn: 'Night',
        descriptionAr: 'وصف',
        descriptionEn: 'Description',
        addressAr: 'عنوان',
        addressEn: 'Address',
        phone: '+963944000000',
        published: true,
        startsAt: new Date('2026-11-01T18:00:00Z'),
      },
    });
    await prisma.event.create({
      data: {
        titleAr: 'مسودة',
        titleEn: 'Draft',
        descriptionAr: 'لا',
        descriptionEn: 'No',
        published: false,
        startsAt: new Date('2026-11-02T18:00:00Z'),
      },
    });
    const list = await request(app.getHttpServer()).get('/client-app/events').expect(200);
    expect(list.body.total).toBe(1);
    const detail = await request(app.getHttpServer())
      .get(`/client-app/events/${event.id}`)
      .expect(200);
    expect(detail.body).toMatchObject({
      titleEn: 'Night',
      descriptionEn: 'Description',
      addressEn: 'Address',
      phone: '+963944000000',
      posterUrl: null,
      placeId: place.id,
    });
  });
});
