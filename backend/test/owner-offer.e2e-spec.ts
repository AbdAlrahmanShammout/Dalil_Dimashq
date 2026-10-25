process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner offers', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;
  const deleted: string[] = [];

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
    const storage = app.get(PhotoStorage);
    storage.uploadObject = async () => undefined;
    storage.deleteObject = async (key: string) => {
      deleted.push(key);
    };
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    deleted.length = 0;
    await prisma.subscription.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates an offer of at most 60 days, stops it, and deletes the image', async () => {
    const token = await signInOwner(app, 'owner-offer@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-offer@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    const blocked = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/offers`)
      .set('Authorization', `Bearer ${token}`)
      .field('titleAr', 'عرض')
      .field('titleEn', 'Deal')
      .field('detailsAr', 'تفاصيل')
      .field('detailsEn', 'Details')
      .field('startsAt', '2026-10-01T00:00:00.000Z')
      .field('endsAt', '2026-11-30T00:00:00.000Z')
      .expect(403);
    expect(blocked.body.code).toBe('premium_required');
    await prisma.subscription.create({
      data: { placeId: place.id, endsAt: new Date('2027-01-01T00:00:00Z') },
    });
    const tooLong = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/offers`)
      .set('Authorization', `Bearer ${token}`)
      .field('titleAr', 'عرض')
      .field('titleEn', 'Deal')
      .field('detailsAr', 'تفاصيل')
      .field('detailsEn', 'Details')
      .field('startsAt', '2026-10-01T00:00:00.000Z')
      .field('endsAt', '2026-12-15T00:00:00.000Z')
      .expect(400);
    expect(tooLong.body.code).toBe('offer_window');
    const created = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/offers`)
      .set('Authorization', `Bearer ${token}`)
      .field('titleAr', 'عرض')
      .field('titleEn', 'Deal')
      .field('detailsAr', 'تفاصيل')
      .field('detailsEn', 'Details')
      .field('startsAt', '2026-10-01T00:00:00.000Z')
      .field('endsAt', '2026-11-30T00:00:00.000Z')
      .attach('file', Buffer.from('jpg'), { filename: 'deal.jpg', contentType: 'image/jpeg' })
      .expect(201);
    const stored = await prisma.offer.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(stored.imageKey).toBe(`${place.id}/deal.jpg`);
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/offers/${created.body.id}/stop`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const stopped = await prisma.offer.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(stopped.endsAt.getTime()).toBeLessThanOrEqual(Date.now());
    await request(app.getHttpServer())
      .delete(`/dashboard-owner/places/${place.id}/offers/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(deleted).toEqual([`${place.id}/deal.jpg`]);
    expect(await prisma.offer.count()).toBe(0);
  });
});

async function signInOwner(app: INestApplication, email: string): Promise<string> {
  await request(app.getHttpServer())
    .post('/dashboard-owner/auth/sign-up')
    .send({ email, password: 'Password123' })
    .expect(201);
  const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
  await request(app.getHttpServer())
    .post('/dashboard-owner/auth/verify-email')
    .send({ email, code })
    .expect(200);
  const session = await request(app.getHttpServer())
    .post('/dashboard-owner/auth/sign-in')
    .send({ email, password: 'Password123' })
    .expect(200);
  return session.body.accessToken as string;
}
