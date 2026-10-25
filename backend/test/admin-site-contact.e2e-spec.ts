import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin site contacts', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.siteContact.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.siteContact.deleteMany();
    await prisma.user.deleteMany();
  });

  it('replaces the public shortcuts', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-contact@example.com',
      staffRole: 'editor',
    });
    const saved = await request(app.getHttpServer())
      .put('/admin-panel/site-contacts')
      .set('Authorization', `Bearer ${editor}`)
      .send({ phone: '0991000000', email: 'hello@dalil.test' })
      .expect(200);
    expect(saved.body.phone).toBe('0991000000');
    expect(saved.body.email).toBe('hello@dalil.test');
    const row = await prisma.siteContact.findUniqueOrThrow({ where: { id: 'site' } });
    expect(row.whatsapp).toBeNull();
  });
});
