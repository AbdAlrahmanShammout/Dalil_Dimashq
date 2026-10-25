process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner closure requests', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeChangeRequest.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.placeChangeRequest.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores a removal and an unlink without changing the live place', async () => {
    const token = await signInOwner(app, 'owner-close@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-close@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    const empty = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/removal`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: '   ' })
      .expect(400);
    expect(empty.body.code).toBe('reason');
    const removal = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/removal`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Closed for good' })
      .expect(201);
    expect(removal.body.kind).toBe('remove');
    const unlink = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/unlink`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Wrong owner' })
      .expect(201);
    expect(unlink.body.kind).toBe('unlink');
    expect(await prisma.place.count()).toBe(1);
    expect(await prisma.placeOwner.count()).toBe(1);
  });
});

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
