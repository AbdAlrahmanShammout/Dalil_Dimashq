import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('lift a booking ban', () => {
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

  it('lifts a ban so the next confirmation starts again at level 1', async () => {
    const moderator = await signInStaff({
      app,
      prisma,
      email: 'moderator-lift@example.com',
      staffRole: 'moderator',
    });
    const visitor = await prisma.user.create({
      data: { email: 'visitor-lift@example.com', passwordHash: 'x', isVisitor: true },
    });
    const owner = await prisma.user.create({
      data: { email: 'owner-lift@example.com', passwordHash: 'x', isOwner: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const ban = await prisma.bookingBan.create({
      data: {
        userId: visitor.id,
        level: 1,
        startsAt: new Date('2026-10-01T00:00:00Z'),
        endsAt: new Date('2026-10-16T00:00:00Z'),
      },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/booking-bans/${ban.id}/lift`)
      .set('Authorization', `Bearer ${moderator}`)
      .send({ note: 'Appeal accepted' })
      .expect(200);
    const lifted = await prisma.bookingBan.findUniqueOrThrow({ where: { id: ban.id } });
    expect(lifted.liftedNote).toBe('Appeal accepted');
    expect(lifted.liftedAt).not.toBeNull();
    const booking = await prisma.booking.create({
      data: {
        clientKey: 'key-lift',
        userId: visitor.id,
        placeId: place.id,
        startsAt: new Date('2026-12-01T18:00:00Z'),
        partySize: 2,
        status: 'confirmed',
      },
    });
    const report = await prisma.fakeReport.create({
      data: { userId: owner.id, placeId: place.id, bookingId: booking.id, message: 'Again' },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/fake-reports/${report.id}/decide`)
      .set('Authorization', `Bearer ${moderator}`)
      .send({ decision: 'confirmed', note: 'Second look', badFaith: false })
      .expect(200);
    const next = await prisma.bookingBan.findFirstOrThrow({
      where: { userId: visitor.id, liftedAt: null },
    });
    expect(next.level).toBe(1);
  });
});
