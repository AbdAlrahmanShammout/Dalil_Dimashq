import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('areas', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.area.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.area.deleteMany();
  });

  it('lists id and both names without a token', async () => {
    await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const response = await request(app.getHttpServer()).get('/client-app/areas').expect(200);
    expect(response.body).toEqual([{ id: expect.any(String), nameAr: 'المزة', nameEn: 'Mazzeh' }]);
  });
});
