import { Injectable } from '@nestjs/common';

import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';
import {
  AmenityCatalogItem,
  AmenityRepository,
  SaveAmenityInput,
} from '@/modules/amenity/repository/amenity.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class AmenityPrismaRepository extends AmenityRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listByPlace(placeId: string): Promise<PlaceAmenityEntity[]> {
    const rows = await this.prisma.placeAmenity.findMany({
      where: { placeId, approved: true },
      include: { amenity: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map(
      (row) =>
        new PlaceAmenityEntity({
          code: row.amenity.code,
          nameAr: row.amenity.nameAr,
          nameEn: row.amenity.nameEn,
          sortOrder: row.sortOrder,
          approved: row.approved,
        }),
    );
  }

  override async listCatalog(): Promise<AmenityCatalogItem[]> {
    const rows = await this.prisma.amenity.findMany({
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    });
    return rows.map((row) => this.toItem(row));
  }

  override async findCatalogItem(code: string): Promise<AmenityCatalogItem | null> {
    const row = await this.prisma.amenity.findUnique({ where: { code } });
    return row ? this.toItem(row) : null;
  }

  override async attach(placeId: string, code: string): Promise<boolean> {
    const amenity = await this.prisma.amenity.findUnique({ where: { code } });
    if (!amenity) {
      return false;
    }
    await this.prisma.placeAmenity.upsert({
      where: { placeId_amenityId: { placeId, amenityId: amenity.id } },
      create: { placeId, amenityId: amenity.id, approved: true },
      update: { approved: true },
    });
    return true;
  }

  override async detach(placeId: string, code: string): Promise<void> {
    const amenity = await this.prisma.amenity.findUnique({ where: { code } });
    if (!amenity) {
      return;
    }
    await this.prisma.placeAmenity.deleteMany({
      where: { placeId, amenityId: amenity.id },
    });
  }

  override async createAmenity(input: SaveAmenityInput): Promise<AmenityCatalogItem> {
    const row = await this.prisma.amenity.create({ data: input });
    return this.toItem(row);
  }

  override async updateAmenity(
    id: string,
    input: SaveAmenityInput,
  ): Promise<AmenityCatalogItem | null> {
    const existing = await this.prisma.amenity.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const row = await this.prisma.amenity.update({ where: { id }, data: input });
    return this.toItem(row);
  }

  override async deleteAmenity(id: string): Promise<boolean> {
    const result = await this.prisma.amenity.deleteMany({ where: { id } });
    return result.count > 0;
  }

  private toItem(row: {
    id: string;
    code: string;
    nameAr: string;
    nameEn: string;
    sortOrder: number;
  }): AmenityCatalogItem {
    return {
      id: row.id,
      code: row.code,
      nameAr: row.nameAr,
      nameEn: row.nameEn,
      sortOrder: row.sortOrder,
    };
  }
}
