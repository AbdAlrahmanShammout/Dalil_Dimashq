import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('fake report decision', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.bookingBan.deleteMany();
    await prisma.fakeReport.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.notification.deleteMany();
    await prisma.bookingBan.deleteMany();
    await prisma.fakeReport.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('confirms a report and starts a 15-day ban', async () => {
    const moderator = await signInStaff({
      app,
      prisma,
      email: 'moderator-fake@example.com',
      staffRole: 'moderator',
    });
    const visitor = await prisma.user.create({
      data: { email: 'visitor-fake@example.com', passwordHash: 'x', isVisitor: true },
    });
    const owner = await prisma.user.create({
      data: { email: 'owner-fake@example.com', passwordHash: 'x', isOwner: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const booking = await prisma.booking.create({
      data: {
        clientKey: 'key-fake',
        userId: visitor.id,
        placeId: place.id,
        startsAt: new Date('2026-12-01T18:00:00Z'),
        partySize: 2,
        status: 'confirmed',
      },
    });
    const report = await prisma.fakeReport.create({
      data: { userId: owner.id, placeId: place.id, bookingId: booking.id, message: 'No show' },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/fake-reports/${report.id}/decide`)
      .set('Authorization', `Bearer ${moderator}`)
      .send({ decision: 'confirmed', note: 'Pattern', badFaith: true })
      .expect(200);
    const stored = await prisma.fakeReport.findUniqueOrThrow({ where: { id: report.id } });
    expect(stored.status).toBe('confirmed');
    expect(stored.badFaith).toBe(true);
    const ban = await prisma.bookingBan.findFirstOrThrow({ where: { userId: visitor.id } });
    expect(ban.level).toBe(1);
    expect(ban.endsAt).not.toBeNull();
  });
});
