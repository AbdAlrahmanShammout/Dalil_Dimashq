process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner amenities', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeAmenity.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.placeAmenity.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lists the catalog and adds or removes a code on a linked place', async () => {
    const token = await signInOwner(app, 'owner-amenity@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-amenity@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    await prisma.amenity.create({ data: { code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wifi' } });
    const catalog = await request(app.getHttpServer())
      .get('/dashboard-owner/amenities')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(catalog.body.amenities).toEqual([{ code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wifi' }]);
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/amenities/wifi`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const linked = await prisma.placeAmenity.findFirst({ where: { placeId: place.id } });
    expect(linked?.approved).toBe(true);
    await request(app.getHttpServer())
      .delete(`/dashboard-owner/places/${place.id}/amenities/wifi`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(await prisma.placeAmenity.count({ where: { placeId: place.id } })).toBe(0);
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
