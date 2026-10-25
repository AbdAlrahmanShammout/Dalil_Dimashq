process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('recent places', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.recentPlace.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.recentPlace.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('returns the latest distinct opens', async () => {
    const email = 'recent@example.com';
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
    const first = await prisma.place.create({
      data: { nameAr: 'أول', nameEn: 'First', type: 'cafe', status: 'active', areaId: area.id },
    });
    const second = await prisma.place.create({
      data: { nameAr: 'ثان', nameEn: 'Second', type: 'cafe', status: 'active', areaId: area.id },
    });
    const token = session.body.accessToken as string;
    await request(app.getHttpServer())
      .post(`/client-app/recent-places/${first.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    await request(app.getHttpServer())
      .post(`/client-app/recent-places/${second.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    await request(app.getHttpServer())
      .post(`/client-app/recent-places/${first.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const response = await request(app.getHttpServer())
      .get('/client-app/recent-places')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.places.map((place: { id: string }) => place.id)).toEqual([
      first.id,
      second.id,
    ]);
    expect(await prisma.recentPlace.count()).toBe(2);
  });
});
