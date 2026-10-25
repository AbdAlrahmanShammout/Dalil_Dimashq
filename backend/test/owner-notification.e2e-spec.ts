process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner notifications', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await clearNotes(prisma);
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await clearNotes(prisma);
  });

  it('returns only the four owner booking kinds, each with a booking id', async () => {
    const token = await signInOwner(app, 'owner-note@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-note@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const visitor = await prisma.user.create({
      data: { email: 'guest-note@example.com', passwordHash: 'hash', isVisitor: true },
    });
    const booking = await prisma.booking.create({
      data: {
        clientKey: 'note',
        userId: visitor.id,
        placeId: place.id,
        startsAt: new Date('2026-12-01T18:00:00Z'),
        partySize: 2,
      },
    });
    const ownerKinds = [
      'booking_new',
      'booking_clock_started',
      'booking_cancelled_by_customer',
      'fake_report_new',
    ] as const;
    await prisma.notification.createMany({
      data: [
        ...ownerKinds.map((kind) => ({ userId: owner.id, kind, bookingId: booking.id })),
        { userId: owner.id, kind: 'booking_confirmed' as const, bookingId: booking.id },
      ],
    });
    const response = await request(app.getHttpServer())
      .get('/dashboard-owner/notifications')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const kinds = (response.body.notifications as Array<{ kind: string; bookingId: string }>).map(
      (row) => row.kind,
    );
    expect(kinds.sort()).toEqual([...ownerKinds].sort());
    expect(
      (response.body.notifications as Array<{ bookingId: string }>).every(
        (row) => row.bookingId === booking.id,
      ),
    ).toBe(true);
  });
});

async function clearNotes(prisma: PrismaProviderService): Promise<void> {
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.place.deleteMany();
  await prisma.area.deleteMany();
  await prisma.user.deleteMany();
}

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
