import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('contact form', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.contactMessage.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.contactMessage.deleteMany();
  });

  it('stores a message and refuses a honeypot', async () => {
    const honeypot = await request(app.getHttpServer())
      .post('/client-app/contact')
      .send({
        name: 'Ahmad',
        email: 'a@example.com',
        type: 'question',
        message: 'Hi',
        website: 'spam',
      })
      .expect(403);
    expect(honeypot.body.code).toBe('honeypot');
    const stored = await request(app.getHttpServer())
      .post('/client-app/contact')
      .send({ name: 'Ahmad', phone: '0944000000', type: 'question', message: 'Hi' })
      .expect(201);
    expect(stored.body.id).toEqual(expect.any(String));
    expect(await prisma.contactMessage.count()).toBe(1);
  });
});
