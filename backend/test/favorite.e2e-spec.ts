process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('favorites', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.favorite.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.favorite.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('saves a place summary and removes it', async () => {
    const email = 'favorite@example.com';
    await request(app.getHttpServer())
      .post('/client-app/auth/sign-up')
      .send({ email, password: 'Password123' })
      .expect(201);
    const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
    await request(app.getHttpServer())
      .post('/client-app/auth/verify-email')
      .send({ email, code })
      .expect(200);
    const session = await request(app.getHttpServer())
      .post('/client-app/auth/sign-in')
      .send({ email, password: 'Password123' })
      .expect(200);
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const saved = await request(app.getHttpServer())
      .post(`/client-app/favorites/${place.id}`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(201);
    expect(saved.body.favorites).toEqual([
      { id: place.id, nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe' },
    ]);
    const removed = await request(app.getHttpServer())
      .delete(`/client-app/favorites/${place.id}`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(removed.body.removed).toBe(true);
    const empty = await request(app.getHttpServer())
      .get('/client-app/favorites')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(empty.body.favorites).toEqual([]);
  });
});
