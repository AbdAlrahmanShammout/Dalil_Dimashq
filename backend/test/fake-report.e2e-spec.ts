process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('fake report reply', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.fakeReport.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.fakeReport.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('stores a reply only while the report is open', async () => {
    const email = 'report@example.com';
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
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const report = await prisma.fakeReport.create({
      data: { userId: user.id, placeId: place.id, message: 'Did not attend', status: 'open' },
    });
    const response = await request(app.getHttpServer())
      .post(`/client-app/fake-reports/${report.id}/reply`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({ body: 'I was there' })
      .expect(201);
    expect(response.body.id).toEqual(expect.any(String));
    await prisma.fakeReport.update({ where: { id: report.id }, data: { status: 'confirmed' } });
    const closed = await request(app.getHttpServer())
      .post(`/client-app/fake-reports/${report.id}/reply`)
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({ body: 'again' })
      .expect(400);
    expect(closed.body.code).toBe('invalid_state');
  });
});
