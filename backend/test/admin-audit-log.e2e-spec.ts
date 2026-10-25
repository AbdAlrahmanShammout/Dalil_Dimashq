import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin audit log', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
  });

  it('records a staff role change and hides the log from other roles', async () => {
    const admin = await signInStaff({
      app,
      prisma,
      email: 'admin-audit@example.com',
      staffRole: 'admin',
    });
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-audit@example.com',
      staffRole: 'sales',
    });
    const created = await request(app.getHttpServer())
      .post('/admin-panel/staff')
      .set('Authorization', `Bearer ${admin}`)
      .send({ email: 'editor-audit@example.com', password: 'Password123', staffRole: 'editor' })
      .expect(201);
    const listed = await request(app.getHttpServer())
      .get('/admin-panel/audit-log')
      .set('Authorization', `Bearer ${admin}`)
      .expect(200);
    expect(listed.body.entries).toEqual([
      expect.objectContaining({
        action: 'staff_created',
        targetType: 'user',
        targetId: created.body.id,
        note: 'editor',
      }),
    ]);
    await request(app.getHttpServer())
      .get('/admin-panel/audit-log')
      .set('Authorization', `Bearer ${sales}`)
      .expect(403);
  });
});
