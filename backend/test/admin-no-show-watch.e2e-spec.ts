import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('no-show watch', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lists a customer with three recent no-shows and does not ban them', async () => {
    const moderator = await signInStaff({
      app,
      prisma,
      email: 'moderator-watch@example.com',
      staffRole: 'moderator',
    });
    const visitor = await prisma.user.create({
      data: { email: 'visitor-watch@example.com', passwordHash: 'x', isVisitor: true },
    });
    const quiet = await prisma.user.create({
      data: { email: 'quiet-watch@example.com', passwordHash: 'x', isVisitor: true },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const recent = new Date();
    await Promise.all(
      [1, 2, 3].map((index) =>
        prisma.booking.create({
          data: {
            clientKey: `watch-${index}`,
            userId: visitor.id,
            placeId: place.id,
            startsAt: recent,
            partySize: 2,
            status: 'no_show',
          },
        }),
      ),
    );
    await prisma.booking.create({
      data: {
        clientKey: 'quiet-1',
        userId: quiet.id,
        placeId: place.id,
        startsAt: recent,
        partySize: 2,
        status: 'no_show',
      },
    });
    const listed = await request(app.getHttpServer())
      .get('/admin-panel/no-show-watch')
      .set('Authorization', `Bearer ${moderator}`)
      .expect(200);
    expect(listed.body.customers).toEqual([
      expect.objectContaining({ userId: visitor.id, email: visitor.email, count: 3 }),
    ]);
    expect(await prisma.bookingBan.count()).toBe(0);
  });
});
