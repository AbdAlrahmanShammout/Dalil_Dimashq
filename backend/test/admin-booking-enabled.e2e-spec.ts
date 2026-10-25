import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('booking enabled', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeBookingSettings.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.placeBookingSettings.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lets sales switch booking on and an editor switch it off', async () => {
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-booking@example.com',
      staffRole: 'sales',
    });
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-booking@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/places/${place.id}/booking-enabled`)
      .set('Authorization', `Bearer ${sales}`)
      .send({ enabled: true })
      .expect(200);
    const enabled = await prisma.placeBookingSettings.findUniqueOrThrow({
      where: { placeId: place.id },
    });
    expect(enabled.acceptsBookings).toBe(true);
    expect(enabled.noticeMinutes).toBe(60);
    await request(app.getHttpServer())
      .post(`/admin-panel/places/${place.id}/booking-enabled`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ enabled: false })
      .expect(200);
    const disabled = await prisma.placeBookingSettings.findUniqueOrThrow({
      where: { placeId: place.id },
    });
    expect(disabled.acceptsBookings).toBe(false);
  });
});
