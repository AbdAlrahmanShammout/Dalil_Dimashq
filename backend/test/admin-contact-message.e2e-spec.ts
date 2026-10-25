import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin contact messages', () => {
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
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.contactMessage.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lists contact-form rows for an editor', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-inbox@example.com',
      staffRole: 'editor',
    });
    await prisma.contactMessage.create({
      data: {
        name: 'Ahmad',
        email: 'a@example.com',
        type: 'general',
        message: 'Hello',
        visitorKey: 'visitor-1',
      },
    });
    const listed = await request(app.getHttpServer())
      .get('/admin-panel/contact-messages')
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(listed.body.total).toBe(1);
    expect(listed.body.messages[0].email).toBe('a@example.com');
  });
});
