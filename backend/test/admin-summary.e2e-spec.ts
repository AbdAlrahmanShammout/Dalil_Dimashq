import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin summary', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await clearRows(prisma);
    await app.close();
  });

  beforeEach(async () => {
    await clearRows(prisma);
  });

  it('counts pending work and unread alerts', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-summary@example.com',
      staffRole: 'editor',
    });
    const visitor = await prisma.user.create({
      data: { email: 'visitor-summary@example.com', passwordHash: 'hash', isVisitor: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    await prisma.placeChangeRequest.create({
      data: { placeId: place.id, userId: visitor.id, kind: 'report', status: 'pending' },
    });
    await prisma.placeChangeRequest.create({
      data: { placeId: place.id, userId: visitor.id, kind: 'report', status: 'approved' },
    });
    await prisma.profileChangeRequest.create({
      data: {
        userId: visitor.id,
        kind: 'name',
        firstName: 'Sara',
        lastName: 'Ali',
        status: 'pending',
      },
    });
    await prisma.fakeReport.create({
      data: { userId: visitor.id, placeId: place.id, message: 'Not real', status: 'open' },
    });
    await prisma.fakeReport.create({
      data: { userId: visitor.id, placeId: place.id, message: 'Closed', status: 'rejected' },
    });
    await prisma.adminAlert.create({
      data: { kind: 'change_request', message: 'Waiting', readAt: null },
    });
    await prisma.adminAlert.create({
      data: { kind: 'change_request', message: 'Seen', readAt: new Date() },
    });
    const body = await request(app.getHttpServer())
      .get('/admin-panel/summary')
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(body.body).toEqual({
      pendingChangeRequests: 1,
      pendingProfileChanges: 1,
      openFakeReports: 1,
      unreadAlerts: 1,
    });
  });
});

async function clearRows(prisma: PrismaProviderService): Promise<void> {
  await prisma.adminAlert.deleteMany();
  await prisma.fakeReport.deleteMany();
  await prisma.profileChangeRequest.deleteMany();
  await prisma.placeChangeRequest.deleteMany();
  await prisma.place.deleteMany();
  await prisma.area.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
}
