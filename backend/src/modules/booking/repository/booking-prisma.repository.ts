import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  BookingDetail,
  BookingListItem,
  BookingRecord,
  BookingRepository,
  CreateBookingInput,
  ListBookingsInput,
  OwnerBookingRow,
} from '@/modules/booking/repository/booking.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class BookingPrismaRepository extends BookingRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findByClientKey(userId: string, clientKey: string): Promise<BookingRecord | null> {
    const row = await this.prisma.booking.findUnique({
      where: { userId_clientKey: { userId, clientKey } },
    });
    return row ? this.toRecord(row) : null;
  }

  async create(input: CreateBookingInput): Promise<BookingRecord> {
    try {
      const row = await this.prisma.booking.create({
        data: {
          clientKey: input.clientKey,
          userId: input.userId,
          placeId: input.placeId,
          startsAt: input.startsAt,
          partySize: input.partySize,
          note: input.note,
          offerId: input.offerId,
        },
      });
      return this.toRecord(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.findByClientKey(input.userId, input.clientKey);
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
  }

  async listForUser(input: ListBookingsInput): Promise<{ rows: BookingListItem[]; total: number }> {
    const where = { userId: input.userId };
    const [rows, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: input.offset,
        take: input.limit,
      }),
      this.prisma.booking.count({ where }),
    ]);
    return {
      total,
      rows: rows.map((row) => ({
        id: row.id,
        number: row.number,
        placeId: row.placeId,
        startsAt: row.startsAt,
        partySize: row.partySize,
        status: row.status,
      })),
    };
  }

  async findOwned(userId: string, bookingId: string): Promise<BookingDetail | null> {
    const row = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { place: true },
    });
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      number: row.number,
      status: row.status,
      place: { id: row.place.id, nameAr: row.place.nameAr, nameEn: row.place.nameEn },
      startsAt: row.startsAt,
      partySize: row.partySize,
      note: row.note,
      rejectionReason: row.rejectionReason,
      cancellationReason: row.cancellationReason,
    };
  }

  async markCancelledByCustomer(userId: string, bookingId: string): Promise<BookingDetail | null> {
    const updated = await this.prisma.booking.updateMany({
      where: {
        id: bookingId,
        userId,
        status: { in: ['pending', 'waiting', 'confirmed'] },
      },
      data: { status: 'cancelled_by_customer' },
    });
    if (updated.count === 0) {
      return null;
    }
    return this.findOwned(userId, bookingId);
  }

  override async listForPlace(placeId: string): Promise<OwnerBookingRow[]> {
    const rows = await this.prisma.booking.findMany({
      where: { placeId },
      orderBy: { startsAt: 'asc' },
      include: { user: { include: { profile: true } }, fakeReport: true },
    });
    return rows.map((row) => ({
      id: row.id,
      name: [row.user.profile?.firstName, row.user.profile?.lastName].filter(Boolean).join(' '),
      phone: row.user.profile?.phone ?? null,
      partySize: row.partySize,
      startsAt: row.startsAt,
      note: row.note,
      status: row.status,
      reported: row.fakeReport !== null,
    }));
  }

  private toRecord(row: {
    id: string;
    number: number;
    clientKey: string;
    placeId: string;
    startsAt: Date;
    partySize: number;
    note: string | null;
    offerId: string | null;
    status: string;
  }): BookingRecord {
    return {
      id: row.id,
      number: row.number,
      clientKey: row.clientKey,
      placeId: row.placeId,
      startsAt: row.startsAt,
      partySize: row.partySize,
      note: row.note,
      offerId: row.offerId,
      status: row.status,
    };
  }
}
