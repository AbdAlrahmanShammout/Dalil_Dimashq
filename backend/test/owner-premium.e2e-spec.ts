process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner premium and pending requests', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await clearPremium(prisma);
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await clearPremium(prisma);
  });

  it('treats a future subscription end as Premium and counts only pending requests', async () => {
    const token = await signInOwner(app, 'owner-premium@example.com');
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-premium@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const active = await prisma.place.create({
      data: { nameAr: 'فعال', nameEn: 'Active', type: 'cafe', areaId: area.id },
    });
    const expired = await prisma.place.create({
      data: { nameAr: 'منتهٍ', nameEn: 'Expired', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.createMany({
      data: [
        { placeId: active.id, userId: owner.id },
        { placeId: expired.id, userId: owner.id },
      ],
    });
    await prisma.subscription.createMany({
      data: [
        { placeId: active.id, endsAt: new Date('2027-01-01T00:00:00Z') },
        { placeId: expired.id, endsAt: new Date('2020-01-01T00:00:00Z') },
      ],
    });
    await prisma.placeChangeRequest.createMany({
      data: [
        { placeId: active.id, userId: owner.id, kind: 'edit', status: 'pending' },
        { placeId: active.id, userId: owner.id, kind: 'edit', status: 'approved' },
        { placeId: expired.id, userId: owner.id, kind: 'remove', status: 'rejected' },
      ],
    });
    const response = await request(app.getHttpServer())
      .get('/dashboard-owner/places')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const places = response.body.places as Array<{
      id: string;
      premiumActive: boolean;
      pendingRequestCount: number;
    }>;
    const activeRow = places.find((place) => place.id === active.id);
    const expiredRow = places.find((place) => place.id === expired.id);
    expect(activeRow).toMatchObject({ premiumActive: true, pendingRequestCount: 1 });
    expect(expiredRow).toMatchObject({ premiumActive: false, pendingRequestCount: 0 });
  });
});

async function clearPremium(prisma: PrismaProviderService): Promise<void> {
  await prisma.placeChangeRequest.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.placeOwner.deleteMany();
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
