import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin amenities', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.amenity.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.placeAmenity.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lets an editor create, reorder, and delete an amenity', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-amenity@example.com',
      staffRole: 'editor',
    });
    const created = await request(app.getHttpServer())
      .post('/admin-panel/amenities')
      .set('Authorization', `Bearer ${editor}`)
      .send({ code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wifi', sortOrder: 2 })
      .expect(201);
    expect(created.body.sortOrder).toBe(2);
    const updated = await request(app.getHttpServer())
      .patch(`/admin-panel/amenities/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ code: 'wifi', nameAr: 'إنترنت', nameEn: 'Internet', sortOrder: 0 })
      .expect(200);
    expect(updated.body.nameEn).toBe('Internet');
    expect(updated.body.sortOrder).toBe(0);
    await request(app.getHttpServer())
      .delete(`/admin-panel/amenities/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(await prisma.amenity.count()).toBe(0);
  });
});
