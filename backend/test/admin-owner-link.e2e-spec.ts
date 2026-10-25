import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin owner links', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('links an owner, lists the link, and removes it', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-link@example.com',
      staffRole: 'editor',
    });
    const owner = await prisma.user.create({
      data: {
        email: 'owner-link@example.com',
        passwordHash: 'x',
        isOwner: true,
        emailVerifiedAt: new Date(),
      },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/places/${place.id}/owners`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ userId: owner.id })
      .expect(201);
    const listed = await request(app.getHttpServer())
      .get('/admin-panel/owners')
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(listed.body.links).toEqual([
      expect.objectContaining({ placeId: place.id, userId: owner.id, email: owner.email }),
    ]);
    await request(app.getHttpServer())
      .delete(`/admin-panel/places/${place.id}/owners/${owner.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    const after = await prisma.placeOwner.count();
    expect(after).toBe(0);
  });
});
