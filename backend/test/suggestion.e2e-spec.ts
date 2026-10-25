import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('suggestions', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.suggestion.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.suggestion.deleteMany();
  });

  it('stores a suggestion for the panel', async () => {
    const response = await request(app.getHttpServer())
      .post('/client-app/suggestions')
      .send({
        name: 'Ahmad',
        contact: 'a@example.com',
        kind: 'closed_place',
        message: 'This cafe closed',
      })
      .expect(201);
    expect(response.body.code).toBe('suggestion_received');
    expect(await prisma.suggestion.count()).toBe(1);
  });
});
