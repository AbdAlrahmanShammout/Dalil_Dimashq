process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';
import { signInStaff } from './support/sign-in-staff';

describe('admin alerts', () => {
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
    clearCapturedMail();
    await clearRows(prisma);
  });

  it('lists an unread change-request alert and then marks it read', async () => {
    const visitor = await signInVisitor(app, 'alert-visitor@example.com');
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-alerts@example.com',
      staffRole: 'editor',
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', status: 'active', areaId: area.id },
    });
    const report = await request(app.getHttpServer())
      .post(`/client-app/places/${place.id}/reports`)
      .set('Authorization', `Bearer ${visitor}`)
      .send({ reason: 'The phone is wrong' })
      .expect(201);
    const listed = await request(app.getHttpServer())
      .get('/admin-panel/alerts')
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(listed.body.alerts).toEqual([
      expect.objectContaining({
        kind: 'change_request',
        targetId: report.body.id,
        message: 'A place change request was opened',
      }),
    ]);
    await request(app.getHttpServer())
      .post(`/admin-panel/alerts/${listed.body.alerts[0].id}/read`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    const after = await request(app.getHttpServer())
      .get('/admin-panel/alerts')
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(after.body.alerts).toEqual([]);
  });
});

async function clearRows(prisma: PrismaProviderService): Promise<void> {
  await prisma.adminAlert.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.placeChangeRequest.deleteMany();
  await prisma.place.deleteMany();
  await prisma.area.deleteMany();
  await prisma.user.deleteMany();
}

async function signInVisitor(app: INestApplication, email: string): Promise<string> {
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
