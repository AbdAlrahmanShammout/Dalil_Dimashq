import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('staff photo and offer removal', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;
  const deleted: string[] = [];

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
    const storage = app.get(PhotoStorage);
    storage.deleteObject = async (key: string) => {
      deleted.push(key);
    };
  });

  afterAll(async () => {
    await clearRows(prisma);
    await app.close();
  });

  beforeEach(async () => {
    deleted.length = 0;
    await clearRows(prisma);
  });

  it('deletes a photo and an offer without Premium and removes the stored objects', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-media@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const photo = await prisma.placePhoto.create({
      data: { placeId: place.id, objectKey: 'place/photo.jpg' },
    });
    const offer = await prisma.offer.create({
      data: {
        placeId: place.id,
        titleAr: 'عرض',
        titleEn: 'Deal',
        detailsAr: 'تفاصيل',
        detailsEn: 'Details',
        imageKey: 'place/offer.jpg',
        startsAt: new Date('2026-10-01T00:00:00.000Z'),
        endsAt: new Date('2026-11-01T00:00:00.000Z'),
      },
    });
    await request(app.getHttpServer())
      .delete(`/admin-panel/photos/${photo.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/admin-panel/offers/${offer.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(await prisma.placePhoto.count()).toBe(0);
    expect(await prisma.offer.count()).toBe(0);
    expect(deleted).toEqual(['place/photo.jpg', 'place/offer.jpg']);
    expect(await prisma.subscription.count()).toBe(0);
  });
});

async function clearRows(prisma: PrismaProviderService): Promise<void> {
  await prisma.placePhoto.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.place.deleteMany();
  await prisma.area.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
}
