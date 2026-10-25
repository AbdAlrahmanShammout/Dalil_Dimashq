process.env.MAIL_CAPTURE = 'true';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { capturedMail, clearCapturedMail } from '@/providers/mail/mail-capture';

describe('owner places', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.placeChangeRequest.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    clearCapturedMail();
    await prisma.placeChangeRequest.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.placeOwner.deleteMany();
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.user.deleteMany();
  });

  it('lists only places linked to the owner', async () => {
    const token = await signInOwner(app, 'owner-places@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-places@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const linked = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        addressAr: 'المزة',
        addressEn: 'Mazzeh',
      },
    });
    await prisma.place.create({
      data: { nameAr: 'آخر', nameEn: 'Other', type: 'hotel', status: 'active', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: linked.id, userId: user.id } });
    const listed = await request(app.getHttpServer())
      .get('/dashboard-owner/places')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(listed.body.places).toEqual([
      {
        id: linked.id,
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        addressAr: 'المزة',
        addressEn: 'Mazzeh',
        premiumActive: false,
        premiumEndsAt: null,
        pendingRequestCount: 0,
      },
    ]);
    const endsAt = new Date('2027-01-01T00:00:00.000Z');
    await prisma.subscription.create({ data: { placeId: linked.id, endsAt } });
    await prisma.placeChangeRequest.create({
      data: {
        placeId: linked.id,
        userId: user.id,
        kind: 'report',
        reason: 'Hours',
        status: 'pending',
      },
    });
    const premium = await request(app.getHttpServer())
      .get('/dashboard-owner/places')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(premium.body.places[0].premiumActive).toBe(true);
    expect(premium.body.places[0].premiumEndsAt).toBe(endsAt.toISOString());
    expect(premium.body.places[0].pendingRequestCount).toBe(1);
  });

  it('pages name matches without a link', async () => {
    const token = await signInOwner(app, 'owner-search@example.com');
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    await prisma.place.create({
      data: { nameAr: 'كافيه واحد', nameEn: 'Cafe One', type: 'cafe', areaId: area.id },
    });
    await prisma.place.create({
      data: { nameAr: 'كافيه اثنان', nameEn: 'Cafe Two', type: 'cafe', areaId: area.id },
    });
    await prisma.place.create({
      data: { nameAr: 'فندق', nameEn: 'Hotel', type: 'hotel', areaId: area.id },
    });
    await prisma.place.create({
      data: {
        nameAr: 'كافيه مخفي',
        nameEn: 'Cafe Hidden',
        type: 'cafe',
        status: 'hidden',
        areaId: area.id,
      },
    });
    const page = await request(app.getHttpServer())
      .get('/dashboard-owner/places/search')
      .query({ name: 'cafe', limit: 1, offset: 0 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(page.body.total).toBe(2);
    expect(page.body.places).toHaveLength(1);
    expect(page.body.nextOffset).toBe(1);
    expect(page.body.places[0].nameEn).toBe('Cafe One');
  });

  it('links a place when the claim code matches', async () => {
    const token = await signInOwner(app, 'owner-claim@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-claim@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        areaId: area.id,
        claimCode: 'DD-1001',
      },
    });
    const wrong = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/claim-code`)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'DD-0000' })
      .expect(400);
    expect(wrong.body.code).toBe('invalid_code');
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/claim-code`)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'DD-1001' })
      .expect(200);
    const link = await prisma.placeOwner.findUnique({
      where: { placeId_userId: { placeId: place.id, userId: user.id } },
    });
    expect(link).not.toBeNull();
  });

  it('opens a claim without linking the place', async () => {
    const token = await signInOwner(app, 'owner-open-claim@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-open-claim@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    const created = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/claims`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(created.body).toMatchObject({ kind: 'claim', status: 'pending' });
    const stored = await prisma.placeChangeRequest.findFirst({ where: { placeId: place.id } });
    expect(stored?.userId).toBe(user.id);
    expect(stored?.payload).toBeNull();
    const link = await prisma.placeOwner.findFirst({ where: { placeId: place.id } });
    expect(link).toBeNull();
  });

  it('refuses an unlinked owner on a place route and still allows claim and search', async () => {
    const token = await signInOwner(app, 'owner-policy@example.com');
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe Policy', type: 'cafe', areaId: area.id },
    });
    const refused = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
    expect(refused.body.code).toBe('not_linked');
    await request(app.getHttpServer())
      .get('/dashboard-owner/places/search')
      .query({ name: 'Policy' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/claims`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-policy@example.com' },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    const summary = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(summary.body).toEqual({
      id: place.id,
      nameAr: 'مقهى',
      nameEn: 'Cafe Policy',
      type: 'cafe',
      addressAr: null,
      addressEn: null,
    });
  });

  it('writes Premium contact fields and refuses them otherwise', async () => {
    const token = await signInOwner(app, 'owner-immediate@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-immediate@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    const blocked = await request(app.getHttpServer())
      .patch(`/dashboard-owner/places/${place.id}/immediate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '0944555555', descriptionAr: 'هادئ', descriptionEn: 'Quiet' })
      .expect(403);
    expect(blocked.body.code).toBe('premium_required');
    await prisma.subscription.create({
      data: { placeId: place.id, endsAt: new Date('2027-01-01T00:00:00Z') },
    });
    const saved = await request(app.getHttpServer())
      .patch(`/dashboard-owner/places/${place.id}/immediate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '0944555555', descriptionAr: 'هادئ', descriptionEn: 'Quiet' })
      .expect(200);
    expect(saved.body.phone).toBe('0944555555');
    expect(saved.body.descriptionEn).toBe('Quiet');
    const stored = await prisma.place.findUniqueOrThrow({ where: { id: place.id } });
    expect(stored.descriptionAr).toBe('هادئ');
  });

  it('stores a reviewed edit and leaves the live place unchanged', async () => {
    const token = await signInOwner(app, 'owner-edit@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-edit@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    const created = await request(app.getHttpServer())
      .post(`/dashboard-owner/places/${place.id}/change-requests`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nameEn: 'New Cafe', type: 'motel', addressEn: 'Mazzeh', tourismClass: '4' })
      .expect(201);
    expect(created.body).toMatchObject({ kind: 'edit', status: 'pending' });
    const stored = await prisma.placeChangeRequest.findFirstOrThrow({
      where: { placeId: place.id },
    });
    expect(stored.payload).toMatchObject({
      nameEn: 'New Cafe',
      type: 'motel',
      addressEn: 'Mazzeh',
      tourismClass: '4',
    });
    const live = await prisma.place.findUniqueOrThrow({ where: { id: place.id } });
    expect(live.nameEn).toBe('Cafe');
    expect(live.type).toBe('cafe');
  });

  it('lists pending, approved, and rejected requests with the decision note', async () => {
    const token = await signInOwner(app, 'owner-requests@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'owner-requests@example.com' },
    });
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe', areaId: area.id },
    });
    await prisma.placeOwner.create({ data: { placeId: place.id, userId: user.id } });
    await prisma.placeChangeRequest.create({
      data: {
        placeId: place.id,
        userId: user.id,
        kind: 'edit',
        status: 'approved',
        decisionNote: 'Accepted the name',
      },
    });
    await prisma.placeChangeRequest.create({
      data: {
        placeId: place.id,
        userId: user.id,
        kind: 'edit',
        status: 'rejected',
        decisionNote: 'Address is unclear',
      },
    });
    const listed = await request(app.getHttpServer())
      .get(`/dashboard-owner/places/${place.id}/change-requests`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const statuses = listed.body.requests.map(
      (row: { status: string; displayStatus: string; decisionNote: string }) => ({
        status: row.status,
        displayStatus: row.displayStatus,
        decisionNote: row.decisionNote,
      }),
    );
    expect(statuses).toEqual(
      expect.arrayContaining([
        { status: 'approved', displayStatus: 'accepted', decisionNote: 'Accepted the name' },
        { status: 'rejected', displayStatus: 'rejected', decisionNote: 'Address is unclear' },
      ]),
    );
  });
});

async function signInOwner(app: INestApplication, email: string): Promise<string> {
  await request(app.getHttpServer())
    .post('/dashboard-owner/auth/sign-up')
    .send({ email, password: 'Password123' })
    .expect(201);
  const code = (capturedMail.at(-1)?.text ?? '').match(/\d{6}/)?.[0];
  await request(app.getHttpServer())
    .post('/dashboard-owner/auth/verify-email')
    .send({ email, code })
    .expect(200);
  const session = await request(app.getHttpServer())
    .post('/dashboard-owner/auth/sign-in')
    .send({ email, password: 'Password123' })
    .expect(200);
  return session.body.accessToken as string;
}
