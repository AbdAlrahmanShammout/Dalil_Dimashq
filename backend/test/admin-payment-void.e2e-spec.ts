import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('void a payment', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.paymentVoid.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.paymentVoid.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores the reason beside the payment and leaves the payment row unchanged', async () => {
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-void@example.com',
      staffRole: 'sales',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const payment = await prisma.payment.create({
      data: {
        placeId: place.id,
        amount: 80000,
        currency: 'SYP',
        method: 'cash',
        item: 'Premium',
        payer: 'Ahmad',
        receiptNumber: 'DD-26-10-0007',
      },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/payments/${payment.id}/void`)
      .set('Authorization', `Bearer ${sales}`)
      .send({ reason: 'Entered twice' })
      .expect(201);
    const stored = await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
    expect(stored.amount).toBe(80000);
    expect(stored.payer).toBe('Ahmad');
    const voided = await prisma.paymentVoid.findUniqueOrThrow({ where: { paymentId: payment.id } });
    expect(voided.reason).toBe('Entered twice');
    await request(app.getHttpServer())
      .post(`/admin-panel/payments/${payment.id}/void`)
      .set('Authorization', `Bearer ${sales}`)
      .send({ reason: 'Again' })
      .expect(400);
  });
});
