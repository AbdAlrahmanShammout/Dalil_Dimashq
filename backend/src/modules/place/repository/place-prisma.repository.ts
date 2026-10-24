import { Injectable } from '@nestjs/common';
import { PlaceStatus, PlaceType } from '@prisma/client';

import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceMapper } from '@/modules/place/mapper/place.mapper';
import { PlaceCounts, PlaceRepository } from '@/modules/place/repository/place.repository';
import { placeDetailsInclude } from '@/modules/place/types/place-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

const HOTEL_TYPES = [
  PlaceType.hotel,
  PlaceType.guest_house,
  PlaceType.hostel,
  PlaceType.motel,
] as const;

@Injectable()
export class PlacePrismaRepository extends PlaceRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findPublicById(id: string): Promise<PlaceEntity | null> {
    const row = await this.prisma.place.findFirst({
      where: { id, status: { not: PlaceStatus.hidden } },
      include: placeDetailsInclude,
    });
    return row ? PlaceMapper.toEntity(row) : null;
  }

  async countPublic(): Promise<PlaceCounts> {
    const visible = { status: { not: PlaceStatus.hidden } };
    const [all, hotels, restaurants, cafes] = await Promise.all([
      this.prisma.place.count({ where: visible }),
      this.prisma.place.count({ where: { ...visible, type: { in: [...HOTEL_TYPES] } } }),
      this.prisma.place.count({
        where: { ...visible, type: { in: [PlaceType.restaurant, PlaceType.fast_food] } },
      }),
      this.prisma.place.count({ where: { ...visible, type: PlaceType.cafe } }),
    ]);
    return { all, hotels, restaurants, cafes };
  }
}
