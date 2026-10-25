import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { GoogleMapsManagerService } from '@/providers/google-maps/google-maps-manager.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin places', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
    const maps = app.get(GoogleMapsManagerService);
    maps.geocodeAddress = async () => ({ latitude: 33.51, longitude: 36.29 });
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

  it('creates a place, geocodes the address, and lets an editor hide it', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-place@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const created = await request(app.getHttpServer())
      .post('/admin-panel/places')
      .set('Authorization', `Bearer ${editor}`)
      .send({
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        addressEn: 'Mazzeh, Damascus',
      })
      .expect(201);
    const stored = await prisma.place.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(stored.claimCode?.startsWith('DD-')).toBe(true);
    expect(stored.latitude).toBe(33.51);
    expect(stored.longitude).toBe(36.29);
    await request(app.getHttpServer())
      .patch(`/admin-panel/places/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .send({
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'hidden',
        areaId: area.id,
        addressEn: 'Mazzeh, Damascus',
      })
      .expect(200);
    const hidden = await prisma.place.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(hidden.status).toBe('hidden');
  });
});
