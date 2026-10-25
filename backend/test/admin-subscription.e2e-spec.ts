import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin subscriptions', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.subscription.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lets sales open and move a Premium window', async () => {
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-premium@example.com',
      staffRole: 'sales',
    });
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-premium@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await request(app.getHttpServer())
      .post('/admin-panel/subscriptions')
      .set('Authorization', `Bearer ${editor}`)
      .send({ placeId: place.id, endsAt: '2027-01-01T00:00:00.000Z' })
      .expect(403);
    const created = await request(app.getHttpServer())
      .post('/admin-panel/subscriptions')
      .set('Authorization', `Bearer ${sales}`)
      .send({ placeId: place.id, endsAt: '2027-01-01T00:00:00.000Z' })
      .expect(201);
    const moved = await request(app.getHttpServer())
      .patch(`/admin-panel/subscriptions/${created.body.id}`)
      .set('Authorization', `Bearer ${sales}`)
      .send({ endsAt: '2027-06-01T00:00:00.000Z' })
      .expect(200);
    expect(new Date(moved.body.endsAt).toISOString()).toBe('2027-06-01T00:00:00.000Z');
  });
});
