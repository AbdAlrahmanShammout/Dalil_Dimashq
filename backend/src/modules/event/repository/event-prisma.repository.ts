import { Injectable } from '@nestjs/common';
import { PlaceStatus } from '@prisma/client';

import { EventEntity } from '@/modules/event/entity/event.entity';
import { EventPage, EventRepository } from '@/modules/event/repository/event.repository';
import { PlaceMapper } from '@/modules/place/mapper/place.mapper';
import { placeDetailsInclude } from '@/modules/place/types/place-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

const eventInclude = {
  place: { include: placeDetailsInclude },
} as const;

@Injectable()
export class EventPrismaRepository extends EventRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listPublished(limit: number, offset: number): Promise<EventPage> {
    const where = { published: true };
    const [rows, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: eventInclude,
        orderBy: { startsAt: 'asc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.event.count({ where }),
    ]);
    return { items: rows.map((row) => this.toEntity(row)), total, limit, offset };
  }

  async findPublishedById(id: string): Promise<EventEntity | null> {
    const row = await this.prisma.event.findFirst({
      where: { id, published: true },
      include: eventInclude,
    });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: {
    id: string;
    placeId: string | null;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    addressAr: string | null;
    addressEn: string | null;
    phone: string | null;
    posterKey: string | null;
    startsAt: Date;
    place: Parameters<typeof PlaceMapper.toEntity>[0] | null;
  }): EventEntity {
    const event = new EventEntity({
      id: row.id,
      placeId: row.placeId,
      titleAr: row.titleAr,
      titleEn: row.titleEn,
      descriptionAr: row.descriptionAr,
      descriptionEn: row.descriptionEn,
      addressAr: row.addressAr,
      addressEn: row.addressEn,
      phone: row.phone,
      posterKey: row.posterKey,
      startsAt: row.startsAt,
    });
    if (row.place && row.place.status !== PlaceStatus.hidden) {
      event.place = PlaceMapper.toEntity(row.place);
    }
    return event;
  }
}
