import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin featured places', () => {
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

  it('features a place and then removes it', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-featured@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await request(app.getHttpServer())
      .post('/admin-panel/featured')
      .set('Authorization', `Bearer ${editor}`)
      .send({ placeId: place.id })
      .expect(201);
    const featured = await prisma.place.findUniqueOrThrow({ where: { id: place.id } });
    expect(featured.isFeatured).toBe(true);
    await request(app.getHttpServer())
      .delete(`/admin-panel/featured/${place.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    const cleared = await prisma.place.findUniqueOrThrow({ where: { id: place.id } });
    expect(cleared.isFeatured).toBe(false);
  });
});
