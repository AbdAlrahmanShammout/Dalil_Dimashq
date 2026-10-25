import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('held ratings', () => {
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
    await prisma.rating.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('counts a held rating into the public score and rejects another', async () => {
    const moderator = await signInStaff({
      app,
      prisma,
      email: 'moderator-rating@example.com',
      staffRole: 'moderator',
    });
    const visitor = await prisma.user.create({
      data: { email: 'visitor-rating@example.com', passwordHash: 'x', isVisitor: true },
    });
    const other = await prisma.user.create({
      data: { email: 'other-rating@example.com', passwordHash: 'x', isVisitor: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const counted = await prisma.rating.create({
      data: { userId: visitor.id, placeId: place.id, stars: 4, status: 'held' },
    });
    const rejected = await prisma.rating.create({
      data: { userId: other.id, placeId: place.id, stars: 1, status: 'held' },
    });
    await request(app.getHttpServer())
      .post('/admin-panel/ratings/decide')
      .set('Authorization', `Bearer ${moderator}`)
      .send({ ratingId: counted.id, decision: 'counted' })
      .expect(200);
    await request(app.getHttpServer())
      .post('/admin-panel/ratings/decide')
      .set('Authorization', `Bearer ${moderator}`)
      .send({ ratingId: rejected.id, decision: 'rejected' })
      .expect(200);
    const stored = await prisma.place.findUniqueOrThrow({ where: { id: place.id } });
    expect(stored.starValue).toBe(4);
    const rejectedRow = await prisma.rating.findUniqueOrThrow({ where: { id: rejected.id } });
    expect(rejectedRow.status).toBe('rejected');
  });
});
