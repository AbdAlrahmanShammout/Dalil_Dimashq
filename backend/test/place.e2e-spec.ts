import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('place summary', () => {
  let app: INestApplication;
  let prisma: PrismaProviderService;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prisma = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.amenity.deleteMany();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.place.deleteMany();
    await prisma.area.deleteMany();
    await prisma.amenity.deleteMany();
  });

  it('returns the public summary and omits a hidden place', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: {
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        addressAr: 'شارع',
        addressEn: 'Street',
        latitude: 33.51,
        longitude: 36.27,
        isFeatured: true,
        starValue: 4,
        starSource: 'tourism',
        phone: '+963944000000',
      },
    });
    const hidden = await prisma.place.create({
      data: {
        nameAr: 'مخفي',
        nameEn: 'Hidden',
        type: 'hotel',
        status: 'hidden',
        areaId: area.id,
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}`)
      .expect(200);
    expect(response.body).toMatchObject({
      id: place.id,
      nameAr: 'مقهى',
      nameEn: 'Cafe',
      type: 'cafe',
      status: 'active',
      featured: true,
      starLabel: 4,
      starSource: 'tourism',
      photoFallback: 'cafe',
      latitude: 33.51,
      longitude: 36.27,
      phone: '+963944000000',
    });
    expect(response.body.website).toBeUndefined();
    expect(response.body.email).toBeUndefined();
    expect(response.body.area).toEqual({ id: area.id, nameAr: 'المزة', nameEn: 'Mazzeh' });
    expect(response.body.hidden).toBeUndefined();
    await request(app.getHttpServer()).get(`/client-app/places/${hidden.id}`).expect(404);
    const counts = await request(app.getHttpServer()).get('/client-app/places/counts').expect(200);
    expect(counts.body).toEqual({ all: 1, hotels: 0, restaurants: 0, cafes: 1 });
  });

  it('filters search and returns the real total', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    await prisma.place.create({
      data: {
        nameAr: 'مقهى النور',
        nameEn: 'Light Cafe',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        phone: '+963944000001',
        starValue: 5,
        addressEn: 'Light street',
      },
    });
    await prisma.place.create({
      data: {
        nameAr: 'مطعم',
        nameEn: 'Table',
        type: 'restaurant',
        status: 'active',
        areaId: area.id,
        starValue: 2,
      },
    });
    const response = await request(app.getHttpServer())
      .get('/client-app/places')
      .query({ text: 'Light', type: 'cafe', areaId: area.id, minimumStars: 4, hasPhone: true })
      .expect(200);
    expect(response.body.total).toBe(1);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].nameEn).toBe('Light Cafe');
    const byName = await request(app.getHttpServer())
      .get('/client-app/places')
      .query({ sort: 'name' })
      .expect(200);
    expect(byName.body.total).toBe(2);
    expect(byName.body.items.map((item: { nameEn: string }) => item.nameEn)).toEqual([
      'Light Cafe',
      'Table',
    ]);
  });

  it('returns featured places as summaries', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'الشعلان', nameEn: 'Shaalan' } });
    const featured = await prisma.place.create({
      data: {
        nameAr: 'مميز',
        nameEn: 'Featured',
        type: 'hotel',
        status: 'active',
        areaId: area.id,
        isFeatured: true,
      },
    });
    await prisma.place.create({
      data: {
        nameAr: 'عادي',
        nameEn: 'Plain',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
        isFeatured: false,
      },
    });
    const response = await request(app.getHttpServer())
      .get('/client-app/places/featured')
      .expect(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(featured.id);
    expect(response.body[0].featured).toBe(true);
    expect(response.body[0].photoFallback).toBe('hotel');
  });

  it('returns open now and the week, and neither when hours are missing', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const open = await prisma.place.create({
      data: {
        nameAr: 'مفتوح',
        nameEn: 'Open',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
      },
    });
    const closed = await prisma.place.create({
      data: {
        nameAr: 'بدون',
        nameEn: 'No hours',
        type: 'cafe',
        status: 'active',
        areaId: area.id,
      },
    });
    const now = new Date();
    const shifted = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    await prisma.placeHour.create({
      data: {
        placeId: open.id,
        dayOfWeek: shifted.getUTCDay(),
        opensAt: 0,
        closesAt: 24 * 60,
      },
    });
    const openNow = await request(app.getHttpServer())
      .get(`/client-app/places/${open.id}/open-now`)
      .expect(200);
    expect(openNow.body).toEqual({ openNow: true });
    const hours = await request(app.getHttpServer())
      .get(`/client-app/places/${open.id}/hours`)
      .expect(200);
    expect(hours.body.week).toHaveLength(7);
    const missing = await request(app.getHttpServer())
      .get(`/client-app/places/${closed.id}/hours`)
      .expect(200);
    expect(missing.body).toEqual({ week: null });
    const missingNow = await request(app.getHttpServer())
      .get(`/client-app/places/${closed.id}/open-now`)
      .expect(200);
    expect(missingNow.body).toEqual({ openNow: null });
  });

  it('returns approved amenities in sort order', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const place = await prisma.place.create({
      data: { nameAr: 'مكان', nameEn: 'Spot', type: 'cafe', status: 'active', areaId: area.id },
    });
    const wifi = await prisma.amenity.create({
      data: { code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wifi' },
    });
    const parking = await prisma.amenity.create({
      data: { code: 'parking', nameAr: 'موقف', nameEn: 'Parking' },
    });
    await prisma.placeAmenity.create({
      data: { placeId: place.id, amenityId: parking.id, approved: true, sortOrder: 2 },
    });
    await prisma.placeAmenity.create({
      data: { placeId: place.id, amenityId: wifi.id, approved: true, sortOrder: 1 },
    });
    const pending = await prisma.amenity.create({
      data: { code: 'pool', nameAr: 'مسبح', nameEn: 'Pool' },
    });
    await prisma.placeAmenity.create({
      data: { placeId: place.id, amenityId: pending.id, approved: false, sortOrder: 0 },
    });
    const response = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}/amenities`)
      .expect(200);
    expect(response.body.map((item: { code: string }) => item.code)).toEqual(['wifi', 'parking']);
  });

  it('omits hidden photos and does not invent a read url when storage is unset', async () => {
    const area = await prisma.area.create({ data: { nameAr: 'المزة', nameEn: 'Mazzeh' } });
    const empty = await prisma.place.create({
      data: { nameAr: 'فاضي', nameEn: 'Empty', type: 'cafe', status: 'active', areaId: area.id },
    });
    const place = await prisma.place.create({
      data: { nameAr: 'صور', nameEn: 'Photos', type: 'cafe', status: 'active', areaId: area.id },
    });
    await prisma.placePhoto.create({
      data: { placeId: place.id, objectKey: 'hidden.jpg', role: 'gallery', hidden: true },
    });
    await prisma.placePhoto.create({
      data: { placeId: place.id, objectKey: 'cover.jpg', role: 'cover', hidden: false },
    });
    const none = await request(app.getHttpServer())
      .get(`/client-app/places/${empty.id}/photos`)
      .expect(200);
    expect(none.body).toEqual({ photos: [], coverUrl: null, logoUrl: null });
    const blocked = await request(app.getHttpServer())
      .get(`/client-app/places/${place.id}/photos`)
      .expect(503);
    expect(blocked.body.code).toBe('dependency_failure');
    expect(JSON.stringify(blocked.body)).not.toContain('cover.jpg');
  });
});
