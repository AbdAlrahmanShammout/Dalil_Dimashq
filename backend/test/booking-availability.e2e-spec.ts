import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('booking availability', () => {
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

  it('is public and lists closed periods', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        bookingSettings: {
          create: { acceptsBookings: true, horizonDays: 7, noticeMinutes: 90, maxParty: 6 },
        },
        bookingBlackouts: {
          create: {
            startsAt: new Date('2026-11-01T00:00:00Z'),
            endsAt: new Date('2026-11-02T00:00:00Z'),
          },
        },
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}/booking-availability`)
      .expect(200);
    expect(response.body).toMatchObject({
      acceptsBookings: true,
      horizonDays: 7,
      noticeMinutes: 90,
      maxParty: 6,
    });
    expect(response.body.closedPeriods).toHaveLength(1);
    const hidden = await prisma.place.create({
      data: { nameAr: 'مخفي', nameEn: 'Hidden', type: 'cafe', status: 'hidden', areaId: area.id },
    });
    await request(app.getHttpServer())
      .get(`/client-app/places/${hidden.id}/booking-availability`)
      .expect(404);
  });
});
