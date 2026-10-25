import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin legal publish', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.legalAcceptance.deleteMany();
    await prisma.legalDocument.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.legalAcceptance.deleteMany();
    await prisma.legalDocument.deleteMany();
    await prisma.user.deleteMany();
  });

  it('publishes terms and retires the previous current document', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-legal@example.com',
      staffRole: 'editor',
    });
    const first = await request(app.getHttpServer())
      .post('/admin-panel/legal')
      .set('Authorization', `Bearer ${editor}`)
      .send({ kind: 'terms', language: 'ar', body: 'First' })
      .expect(201);
    const second = await request(app.getHttpServer())
      .post('/admin-panel/legal')
      .set('Authorization', `Bearer ${editor}`)
      .send({ kind: 'terms', language: 'ar', body: 'Second' })
      .expect(201);
    const current = await prisma.legalDocument.findMany({
      where: { kind: 'terms', language: 'ar', isCurrent: true },
    });
    expect(current).toHaveLength(1);
    expect(current[0]?.id).toBe(second.body.id);
    const previous = await prisma.legalDocument.findUniqueOrThrow({ where: { id: first.body.id } });
    expect(previous.isCurrent).toBe(false);
  });
});
