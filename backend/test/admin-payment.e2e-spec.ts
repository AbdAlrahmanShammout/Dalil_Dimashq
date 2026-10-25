import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin payments', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.payment.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('issues a receipt number and refuses one sent by the client', async () => {
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-pay@example.com',
      staffRole: 'sales',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const body = {
      placeId: place.id,
      amount: 150000,
      currency: 'SYP',
      method: 'cash',
      item: 'Premium',
      payer: 'Ahmad',
      periodStart: '2026-10-01T00:00:00.000Z',
      periodEnd: '2026-11-01T00:00:00.000Z',
    };
    await request(app.getHttpServer())
      .post('/admin-panel/payments')
      .set('Authorization', `Bearer ${sales}`)
      .send({ ...body, receiptNumber: 'DD-26-10-9999' })
      .expect(422);
    const recorded = await request(app.getHttpServer())
      .post('/admin-panel/payments')
      .set('Authorization', `Bearer ${sales}`)
      .send(body)
      .expect(201);
    expect(recorded.body.receiptNumber).toMatch(/^DD-26-10-\d{4}$/);
    const stored = await prisma.payment.findUniqueOrThrow({ where: { id: recorded.body.id } });
    expect(stored.amount).toBe(150000);
    expect(stored.receiptNumber).toBe(recorded.body.receiptNumber);
  });
});
