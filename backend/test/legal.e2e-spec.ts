process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('legal current', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.legalDocument.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.legalDocument.deleteMany();
  });

  it('returns the current text for the requested kind and language', async () => {
    await prisma.legalDocument.create({
      data: { kind: 'terms', language: 'ar', body: 'شروط', isCurrent: true },
    });
    await prisma.legalDocument.create({
      data: { kind: 'terms', language: 'en', body: 'Terms', isCurrent: true },
    });
    const arabic = await request(app.getHttpServer())
      .get('/client-app/legal/current')
      .query({ kind: 'terms' })
      .expect(200);
    expect(arabic.body).toMatchObject({ kind: 'terms', language: 'ar', body: 'شروط' });
    const english = await request(app.getHttpServer())
      .get('/client-app/legal/current')
      .query({ kind: 'privacy' })
      .set('Accept-Language', 'en')
      .expect(404);
    expect(english.body.code).toBe('not_found');
  });

  it('lists a current document until the visitor accepts it', async () => {
    clearCapturedMail();
    const document = await prisma.legalDocument.create({
      data: { kind: 'privacy', language: 'ar', body: 'خصوصية', isCurrent: true },
    });
    const email = 'legal@example.com';
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
    const pending = await request(app.getHttpServer())
      .get('/client-app/legal/pending')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(pending.body.map((item: { id: string }) => item.id)).toContain(document.id);
    await request(app.getHttpServer())
      .post('/client-app/legal/accept')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .send({ documentId: document.id })
      .expect(201);
    const after = await request(app.getHttpServer())
      .get('/client-app/legal/pending')
      .set('Authorization', `Bearer ${session.body.accessToken}`)
      .expect(200);
    expect(after.body.map((item: { id: string }) => item.id)).not.toContain(document.id);
    await prisma.user.deleteMany();
  });
});
