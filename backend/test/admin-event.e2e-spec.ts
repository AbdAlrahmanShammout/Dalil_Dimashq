import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { signInStaff } from './support/sign-in-staff';

describe('admin events', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;
  const uploaded: string[] = [];
  const deleted: string[] = [];

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
    const storage = app.get(PhotoStorage);
    storage.uploadObject = async (input: { key: string }) => {
      uploaded.push(input.key);
    };
    storage.deleteObject = async (key: string) => {
      deleted.push(key);
    };
  });

  afterAll(async () => {
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    uploaded.length = 0;
    deleted.length = 0;
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates a published event with a poster and deletes the object', async () => {
    const editor = await signInStaff({
      app,
      prisma,
      email: 'editor-event@example.com',
      staffRole: 'editor',
    });
    const created = await request(app.getHttpServer())
      .post('/admin-panel/events')
      .set('Authorization', `Bearer ${editor}`)
      .field('titleAr', 'حدث')
      .field('titleEn', 'Night')
      .field('descriptionAr', 'وصف')
      .field('descriptionEn', 'Description')
      .field('published', 'true')
      .field('startsAt', '2026-11-01T18:00:00.000Z')
      .attach('file', Buffer.from('poster-bytes'), {
        filename: 'poster.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
    const stored = await prisma.event.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(stored.published).toBe(true);
    expect(stored.posterKey).toBe('events/poster.jpg');
    await request(app.getHttpServer())
      .patch(`/admin-panel/events/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .field('titleAr', 'حدث')
      .field('titleEn', 'Night Market')
      .field('descriptionAr', 'وصف')
      .field('descriptionEn', 'Description')
      .field('published', 'false')
      .field('startsAt', '2026-11-01T18:00:00.000Z')
      .expect(200);
    const hidden = await prisma.event.findUniqueOrThrow({ where: { id: created.body.id } });
    expect(hidden.published).toBe(false);
    expect(hidden.titleEn).toBe('Night Market');
    await request(app.getHttpServer())
      .delete(`/admin-panel/events/${created.body.id}`)
      .set('Authorization', `Bearer ${editor}`)
      .expect(200);
    expect(deleted).toContain('events/poster.jpg');
  });
});
