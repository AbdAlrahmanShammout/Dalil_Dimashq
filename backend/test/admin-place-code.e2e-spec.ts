import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin place code', () => {
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
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('returns the DD- code and rotates it', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-code@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        areaId: area.id,
        claimCode: 'DD-100001',
      },
    });
    const current = await request(app.getHttpServer())
      .get(`/admin-panel/places/${place.id}/code`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(current.body.code).toBe('DD-100001');
    const renewed = await request(app.getHttpServer())
      .post(`/admin-panel/places/${place.id}/renew-code`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(201);
    expect(renewed.body.code.startsWith('DD-')).toBe(true);
    expect(renewed.body.code).not.toBe('DD-100001');
  });
});
