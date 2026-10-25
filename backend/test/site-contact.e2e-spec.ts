import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('site contacts', () => {
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
    await app.close();
  });

  it('omits an empty shortcut', async () => {
    await prisma.siteContact.upsert({
      where: { id: 'site' },
      update: { phone: '+963944000000', email: null },
      create: { id: 'site', phone: '+963944000000' },
    });
    const response = await request(app.getHttpServer())
      .get('/client-app/site-contacts')
      .expect(200);
    expect(response.body.phone).toBe('+963944000000');
    expect(response.body.email).toBeUndefined();
  });
});
