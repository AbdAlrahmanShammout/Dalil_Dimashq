import { Injectable } from '@nestjs/common';
import { PlaceStatus, PlaceType, PlacePhotoRole, Prisma } from '@prisma/client';

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
  StaffPlaceWrite,
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

  override async findCoverKey(placeId: string): Promise<string | null> {
    const photo = await this.prisma.placePhoto.findFirst({
      where: { placeId, role: PlacePhotoRole.cover, hidden: false },
      orderBy: { sortOrder: 'asc' },
    });
    return photo?.objectKey ?? null;
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

  override async updateVisitorScore(
    placeId: string,
    starValue: number | null,
    starSource: string | null,
  ): Promise<void> {
    await this.prisma.place.update({
      where: { id: placeId },
      data: { starValue, starSource },
    });
  }

  override async createStaffPlace(input: StaffPlaceWrite): Promise<{ id: string }> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const row = await this.prisma.place.create({
          data: {
            ...this.toPlaceData(input),
            claimCode: nextClaimCode(),
          } as Prisma.PlaceUncheckedCreateInput,
        });
        return { id: row.id };
      } catch (error) {
        const duplicated =
          error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
        if (!duplicated || attempt === 4) {
          throw error;
        }
      }
    }
    throw new Error('claim code was not issued');
  }

  override async updateStaffPlace(id: string, input: StaffPlaceWrite): Promise<boolean> {
    const result = await this.prisma.place.updateMany({
      where: { id },
      data: this.toPlaceData(input),
    });
    return result.count > 0;
  }

  override async readClaimCode(id: string): Promise<string | null> {
    const row = await this.prisma.place.findUnique({ where: { id }, select: { claimCode: true } });
    return row?.claimCode ?? null;
  }

  override async renewClaimCode(id: string): Promise<string | null> {
    const existing = await this.prisma.place.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return null;
    }
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const claimCode = nextClaimCode();
      try {
        const row = await this.prisma.place.update({
          where: { id },
          data: { claimCode },
          select: { claimCode: true },
        });
        return row.claimCode;
      } catch (error) {
        const duplicated =
          error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
        if (!duplicated || attempt === 4) {
          throw error;
        }
      }
    }
    return null;
  }

  override async setFeatured(id: string, featured: boolean): Promise<boolean> {
    const result = await this.prisma.place.updateMany({
      where: { id },
      data: { isFeatured: featured },
    });
    return result.count > 0;
  }

  private toPlaceData(input: StaffPlaceWrite): Prisma.PlaceUncheckedUpdateInput {
    return {
      nameAr: input.nameAr,
      nameEn: input.nameEn,
      type: input.type as PlaceType,
      status: input.status as PlaceStatus,
      areaId: input.areaId,
      addressAr: input.addressAr,
      addressEn: input.addressEn,
      phone: input.phone,
      website: input.website,
      email: input.email,
      facebook: input.facebook,
      instagram: input.instagram,
      descriptionAr: input.descriptionAr,
      descriptionEn: input.descriptionEn,
    };
  }
}

function nextClaimCode(): string {
  const value = Math.floor(100000 + Math.random() * 900000);
  return `DD-${value}`;
}
