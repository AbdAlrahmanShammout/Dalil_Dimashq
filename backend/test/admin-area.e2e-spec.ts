import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin areas', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lets an editor create, rename, and delete an area', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-area@example.com',
      staffRole: 'editor',
    });
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-area@example.com',
      staffRole: 'sales',
    });
    await request(app.getHttpServer())
      .post('/admin-panel/areas')
      .set('Authorization', `Bearer ${sales}`)
      .send({ nameAr: 'المزة', nameEn: 'Mazzeh' })
      .expect(403);
    const created = await request(app.getHttpServer())
      .post('/admin-panel/areas')
      .set('Authorization', `Bearer ${editor}`)
      .send({ nameAr: 'المزة', nameEn: 'Mazzeh' })
      .expect(201);
    const renamed = await request(app.getHttpServer())
      .patch(`/admin-panel/areas/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ nameAr: 'المالكي', nameEn: 'Malki' })
      .expect(200);
    expect(renamed.body.nameEn).toBe('Malki');
    await request(app.getHttpServer())
      .delete(`/admin-panel/areas/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(await prisma.area.count()).toBe(0);
  });
});
