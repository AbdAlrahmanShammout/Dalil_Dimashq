import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin suggestions', () => {
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
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.suggestion.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lists a suggestion, marks it done, and deletes it', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-suggestion@example.com',
      staffRole: 'editor',
    });
    const row = await prisma.suggestion.create({
      data: {
        name: 'Ahmad',
        contact: 'a@example.com',
        kind: 'missing_place',
        message: 'A cafe',
        visitorKey: 'visitor-1',
      },
    });
    const listed = await request(app.getHttpServer())
      .get('/admin-panel/suggestions')
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(listed.body.total).toBe(1);
    expect(listed.body.suggestions[0].status).toBe('open');
    await request(app.getHttpServer())
      .patch(`/admin-panel/suggestions/${row.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ status: 'done' })
      .expect(200);
    const stored = await prisma.suggestion.findUniqueOrThrow({ where: { id: row.id } });
    expect(stored.status).toBe('done');
    await request(app.getHttpServer())
      .delete(`/admin-panel/suggestions/${row.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(await prisma.suggestion.count()).toBe(0);
  });
});
