process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner photos', () => {
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
    await prisma.placePhoto.deleteMany();
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
    await prisma.placePhoto.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores the key, assigns cover, and deletes the object', async () => {
    const token = await signInOwner(app, 'owner-photo@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-photo@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    const blocked = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/photos`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('jpg'), { filename: 'front.jpg', contentType: 'image/jpeg' })
      .expect(403);
    expect(blocked.body.code).toBe('premium_required');
    expect(await prisma.placePhoto.count()).toBe(0);
    await prisma.subscription.create({
      data: { placeId: place.id, endsAt: new Date('2027-01-01T00:00:00Z') },
    });
    const refused = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/photos`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('gif'), { filename: 'front.gif', contentType: 'image/gif' })
      .expect(400);
    expect(refused.body.code).toBe('photo_invalid');
    const created = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/photos`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('jpg'), { filename: 'front.jpg', contentType: 'image/jpeg' })
      .expect(201);
    expect(created.body.objectKey).toBe(`${place.id}/front.jpg`);
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/photos/${created.body.id}/cover`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const cover = await prisma.placePhoto.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(cover.role).toBe('cover');
    await request(app.getHttpServer())
      .delete(`/dashboard-owner/places/${place.id}/photos/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(deleted).toEqual([`${place.id}/front.jpg`]);
    expect(await prisma.placePhoto.count()).toBe(0);
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
