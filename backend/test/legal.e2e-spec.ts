import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

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
});
