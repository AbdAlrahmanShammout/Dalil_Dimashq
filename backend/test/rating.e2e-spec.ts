process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { RatingService } from '@/modules/rating/rating.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('ratings', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.rating.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.rating.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('keeps a held rating off the public score until the phone is verified', async () => {
    const token = await signIn(app, 'rating@example.com');
    await completeProfile(app, token);
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const blocked = await request(app.getHttpServer())
      .post(`/client-app/places/${place.id}/ratings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stars: 5 })
      .expect(400);
    expect(blocked.body.code).toBe('phone_unverified');
    expect(await prisma.rating.count()).toBe(0);
    await request(app.getHttpServer())
      .post('/client-app/profile/phone/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: '000000' })
      .expect(200);
    const created = await request(app.getHttpServer())
      .post(`/client-app/places/${place.id}/ratings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stars: 5 })
      .expect(201);
    expect(created.body.status).toBe('held');
    const stored = await prisma.place.findUnique({ where: { id: place.id } });
    expect(stored?.starValue).toBeNull();
    const again = await request(app.getHttpServer())
      .post(`/client-app/places/${place.id}/ratings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stars: 4 })
      .expect(409);
    expect(again.body.code).toBe('conflict');
    const storedRating = await prisma.rating.findFirstOrThrow({ where: { placeId: place.id } });
    await app.get(RatingService).rejectRating(storedRating.id);
    const rejectedPlace = await prisma.place.findUnique({ where: { id: place.id } });
    expect(rejectedPlace?.starValue).toBeNull();
    await prisma.rating.update({ where: { id: storedRating.id }, data: { status: 'held' } });
    await app.get(RatingService).countRating(storedRating.id);
    const scored = await prisma.place.findUnique({ where: { id: place.id } });
    expect(scored?.starValue).toBe(5);
    expect(scored?.starSource).toBe('visitors');
  });
});

async function signIn(app: INestApplication, email: string): Promise<string> {
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
  return session.body.accessToken as string;
}

async function completeProfile(app: INestApplication, token: string): Promise<void> {
  await request(app.getHttpServer())
    .post('/client-app/profile/complete')
    .set('Authorization', `Bearer ${token}`)
    .send({
      firstName: 'Ahmad',
      lastName: 'Ali',
      phone: '0944444444',
      birthYear: 2000,
      language: 'ar',
    })
    .expect(200);
}
