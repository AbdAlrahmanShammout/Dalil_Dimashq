import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('staff user contacts', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('returns phone and email and leaves the password hash out', async () => {
    const sales = await signInStaff({
      app,
      prisma,
      email: 'sales-contacts@example.com',
      staffRole: 'sales',
    });
    const visitor = await prisma.user.create({
      data: {
        email: 'visitor-contacts@example.com',
        passwordHash: 'secret-hash',
        isVisitor: true,
        emailVerifiedAt: new Date(),
        profile: { create: { phone: '0991000099', firstName: 'Sara', lastName: 'Ali' } },
      },
    });
    const body = await request(app.getHttpServer())
      .get(`/admin-panel/users/${visitor.id}/contacts`)
      .set('Authorization', `Bearer ${sales}`)
      .expect(200);
    expect(body.body).toEqual({
      id: visitor.id,
      email: 'visitor-contacts@example.com',
      phone: '0991000099',
      emailVerified: true,
    });
    expect(JSON.stringify(body.body)).not.toContain('secret-hash');
  });
});
