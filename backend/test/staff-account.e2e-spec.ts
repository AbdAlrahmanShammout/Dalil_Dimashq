import bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('staff accounts', () => {
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

  it('lets only an admin create an editor, moderator, or sales account', async () => {
    const passwordHash = await bcrypt.hash('Password123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash,
        staffRole: 'admin',
        isVisitor: false,
        isOwner: false,
      },
    });
    const admin = await request(app.getHttpServer())
      .post('/admin-panel/auth/sign-in')
      .send({ email: 'admin@example.com', password: 'Password123' })
      .expect(200);
    const created = await request(app.getHttpServer())
      .post('/admin-panel/staff')
      .set('Authorization', `Bearer ${admin.body.accessToken}`)
      .send({ email: 'editor@example.com', password: 'Password123', staffRole: 'editor' })
      .expect(201);
    expect(created.body.staffRole).toBe('editor');
    const stored = await prisma.user.findUniqueOrThrow({ where: { email: 'editor@example.com' } });
    expect(stored.isVisitor).toBe(false);
    expect(stored.isOwner).toBe(false);
    expect(stored.staffRole).toBe('editor');
    const editor = await request(app.getHttpServer())
      .post('/admin-panel/auth/sign-in')
      .send({ email: 'editor@example.com', password: 'Password123' })
      .expect(200);
    await request(app.getHttpServer())
      .post('/admin-panel/staff')
      .set('Authorization', `Bearer ${editor.body.accessToken}`)
      .send({ email: 'sales@example.com', password: 'Password123', staffRole: 'sales' })
      .expect(403);
    const list = await request(app.getHttpServer())
      .get('/admin-panel/staff')
      .set('Authorization', `Bearer ${admin.body.accessToken}`)
      .expect(200);
    const roles = (list.body.staff as Array<{ email: string; staffRole: string }>).map(
      (row) => `${row.email}:${row.staffRole}`,
    );
    expect(roles).toEqual(['admin@example.com:admin', 'editor@example.com:editor']);
  });
});
