import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin change decisions', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeHour.deleteMany();
    await prisma.placeChangeRequest.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.placeHour.deleteMany();
    await prisma.placeChangeRequest.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('approves a claim and an edit, and rejects a report', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-decide@example.com',
      staffRole: 'editor',
    });
    const owner = await prisma.user.create({
      data: { email: 'owner-decide@example.com', passwordHash: 'x', isOwner: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const claim = await prisma.placeChangeRequest.create({
      data: { placeId: place.id, userId: owner.id, kind: 'claim' },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/change-requests/${claim.id}/decide`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ decision: 'approved', note: 'Linked' })
      .expect(201);
    const link = await prisma.placeOwner.findUnique({
      where: { placeId_userId: { placeId: place.id, userId: owner.id } },
    });
    expect(link).not.toBeNull();
    const week = Array.from({ length: 7 }, (_, dayOfWeek) => ({
      dayOfWeek,
      periods: dayOfWeek === 1 ? [{ opensAt: 540, closesAt: 1020 }] : [],
    }));
    const edit = await prisma.placeChangeRequest.create({
      data: {
        placeId: place.id,
        userId: owner.id,
        kind: 'edit',
        payload: { nameEn: 'Cafe Two', hours: week },
      },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/change-requests/${edit.id}/decide`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ decision: 'approved', note: 'Applied' })
      .expect(201);
    const updated = await prisma.place.findUniqueOrThrow({ where: { id: place.id } });
    expect(updated.nameEn).toBe('Cafe Two');
    const hours = await prisma.placeHour.count({ where: { placeId: place.id } });
    expect(hours).toBe(1);
    const report = await prisma.placeChangeRequest.create({
      data: { placeId: place.id, userId: owner.id, kind: 'report', reason: 'Closed' },
    });
    const rejected = await request(app.getHttpServer())
      .post(`/admin-panel/change-requests/${report.id}/decide`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ decision: 'rejected', note: 'Not enough' })
      .expect(201);
    expect(rejected.body.status).toBe('rejected');
  });
});
