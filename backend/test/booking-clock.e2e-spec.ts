import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { BookingClockService } from '@/modules/booking/booking-clock.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('booking reply clock', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('expires a pending booking when the reply window has ended', async () => {
    const user = await prisma.user.create({
      data: { email: 'clock@example.com', isVisitor: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        bookingSettings: { create: { acceptsBookings: true, replyWindowMinutes: 60 } },
      },
    });
    const booking = await prisma.booking.create({
      data: {
        clientKey: 'clock',
        userId: user.id,
        placeId: place.id,
        startsAt: new Date('2026-11-01T12:00:00Z'),
        partySize: 2,
        status: 'pending',
        createdAt: new Date('2026-10-25T08:00:00Z'),
      },
    });
    const expired = await app.get(BookingClockService).expireDue(new Date('2026-10-25T10:00:00Z'));
    expect(expired).toBe(1);
    const stored = await prisma.booking.findUniqueOrThrow({ where: { id: booking.id } });
    expect(stored.status).toBe('expired');
    const note = await prisma.notification.findFirstOrThrow({ where: { bookingId: booking.id } });
    expect(note.kind).toBe('booking_expired');
  });
});
