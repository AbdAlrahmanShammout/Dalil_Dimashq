import bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('place payment history', () => {
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
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('shows the history to the linked owner and to sales', async () => {
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-history@example.com',
      staffRole: 'sales',
    });
    const passwordHash = await bcrypt.hash('Password123', 10);
    const owner = await prisma.user.create({
      data: {
        email: 'owner-history@example.com',
        passwordHash,
        isOwner: true,
        emailVerifiedAt: new Date(),
      },
    });
    const stranger = await prisma.user.create({
      data: {
        email: 'stranger-history@example.com',
        passwordHash,
        isOwner: true,
        emailVerifiedAt: new Date(),
      },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: owner.id } });
    await prisma.payment.create({
      data: {
        placeId: place.id,
        amount: 50000,
        currency: 'SYP',
        method: 'cash',
        item: 'Premium',
        payer: 'Ahmad',
        receiptNumber: 'DD-26-10-0003',
      },
    });
    const ownerSession = await request(app.getHttpServer())
      .post('/dashboard-owner/auth/sign-in')
      .send({ email: owner.email, password: 'Password123' })
      .expect(200);
    const strangerSession = await request(app.getHttpServer())
      .post('/dashboard-owner/auth/sign-in')
      .send({ email: stranger.email, password: 'Password123' })
      .expect(200);
    const listed = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}/payments`)
      .set('Authorization', `Bearer ${ownerSession.body.accessToken}`)
      .expect(200);
    expect(listed.body.payments).toEqual([
      expect.objectContaining({ receiptNumber: 'DD-26-10-0003', amount: 50000 }),
    ]);
    await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}/payments`)
      .set('Authorization', `Bearer ${strangerSession.body.accessToken}`)
      .expect(403);
    const staff = await request(app.getHttpServer())
      .get(`/admin-panel/places/${place.id}/payments`)
      .set('Authorization', `Bearer ${sales}`)
      .expect(200);
    expect(staff.body.payments).toHaveLength(1);
  });
});
