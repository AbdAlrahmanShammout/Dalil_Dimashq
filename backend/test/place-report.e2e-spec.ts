process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('place reports', () => {
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
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.placeChangeRequest.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores a report and refuses an empty reason', async () => {
    const token = await signIn(app, 'report@example.com');
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const empty = await request(app.getHttpServer())
      .post(`/client-app/places/${place.id}/reports`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: '  ' })
      .expect(400);
    expect(empty.body.code).toBe('reason');
    const created = await request(app.getHttpServer())
      .post(`/client-app/places/${place.id}/reports`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'The phone is wrong' })
      .expect(201);
    expect(created.body).toMatchObject({ kind: 'report', status: 'pending' });
    const stored = await prisma.placeChangeRequest.findFirst({ where: { placeId: place.id } });
    expect(stored?.kind).toBe('report');
    expect(stored?.reason).toBe('The phone is wrong');
  });
});

async function signIn(app: INestApplication, email: string): Promise<string> {
  await request(app.getHttpServer())
    .post('/client-app/auth/sign-up')
    .send({ email, password: 'Password123' })
    .expect(201);
  const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
  await request(app.getHttpServer())
    .post('/client-app/auth/verify-email')
    .send({ email, code })
    .expect(200);
  const session = await request(app.getHttpServer())
    .post('/client-app/auth/sign-in')
    .send({ email, password: 'Password123' })
    .expect(200);
  return session.body.accessToken as string;
}
