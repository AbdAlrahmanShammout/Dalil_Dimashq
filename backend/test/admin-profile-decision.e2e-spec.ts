import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin profile decisions', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.profileChangeRequest.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.profileChangeRequest.deleteMany();
    await prisma.user.deleteMany();
  });

  it('applies an approved name and leaves a rejected year unchanged', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-profile@example.com',
      staffRole: 'editor',
    });
    const visitor = await prisma.user.create({
      data: {
        email: 'visitor-profile@example.com',
        passwordHash: 'x',
        isVisitor: true,
        profile: {
          create: { firstName: 'Ali', lastName: 'Hassan', birthYear: 1990, phone: '0991000001' },
        },
      },
    });
    const nameChange = await prisma.profileChangeRequest.create({
      data: { userId: visitor.id, kind: 'name', firstName: 'Omar', lastName: 'Hassan' },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/profile-change-requests/${nameChange.id}/decide`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ decision: 'approved' })
      .expect(201);
    const profile = await prisma.profile.findUniqueOrThrow({ where: { userId: visitor.id } });
    expect(profile.firstName).toBe('Omar');
    const yearChange = await prisma.profileChangeRequest.create({
      data: { userId: visitor.id, kind: 'birth_year', birthYear: 1988 },
    });
    await request(app.getHttpServer())
      .post(`/admin-panel/profile-change-requests/${yearChange.id}/decide`)
      .set('Authorization', `Bearer ${editor}`)
      .send({ decision: 'rejected' })
      .expect(201);
    const after = await prisma.profile.findUniqueOrThrow({ where: { userId: visitor.id } });
    expect(after.birthYear).toBe(1990);
  });
});
