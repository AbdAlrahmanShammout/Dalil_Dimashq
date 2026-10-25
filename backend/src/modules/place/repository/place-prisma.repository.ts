import { Injectable } from '@nestjs/common';
import { PlaceStatus, PlaceType, PlacePhotoRole } from '@prisma/client';

import { AreaMapper } from '@/modules/area/mapper/area.mapper';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceType as DomainPlaceType } from '@/modules/place/enum/general.enum';
import { PlaceMapper } from '@/modules/place/mapper/place.mapper';
import {
  DirectoryPlace,
  PlaceCounts,
  PlaceRepository,
  SaveGeocodeRepoInput,
  SaveGeocodeResult,
} from '@/modules/place/repository/place.repository';
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

  async listFeatured(): Promise<PlaceEntity[]> {
    const rows = await this.prisma.place.findMany({
      where: { isFeatured: true, status: { not: PlaceStatus.hidden } },
      include: placeDetailsInclude,
      orderBy: { nameEn: 'asc' },
    });
    return rows.map((row) => PlaceMapper.toEntity(row));
  }

  override async findAnyById(id: string): Promise<PlaceEntity | null> {
    const row = await this.prisma.place.findUnique({
      where: { id },
      include: placeDetailsInclude,
    });
    return row ? PlaceMapper.toEntity(row) : null;
  }

  override async listDirectory(): Promise<DirectoryPlace[]> {
    const rows = await this.prisma.place.findMany({
      where: { status: { not: PlaceStatus.hidden } },
      include: {
        area: true,
        photos: { where: { role: PlacePhotoRole.cover, hidden: false }, take: 1 },
      },
      orderBy: { nameEn: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      nameAr: row.nameAr,
      nameEn: row.nameEn,
      type: row.type as DomainPlaceType,
      area: AreaMapper.toEntity(row.area),
      coverKey: row.photos[0]?.objectKey ?? null,
    }));
  }

  override async saveGeocode(input: SaveGeocodeRepoInput): Promise<SaveGeocodeResult> {
    const row = await this.prisma.place.update({
      where: { id: input.id },
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        geocodeFailedAt: input.geocodeFailedAt,
      },
    });
    return {
      latitude: row.latitude,
      longitude: row.longitude,
      geocodeFailedAt: row.geocodeFailedAt,
    };
  }
}
