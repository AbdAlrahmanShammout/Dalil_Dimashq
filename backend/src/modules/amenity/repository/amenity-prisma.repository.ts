import { Injectable } from '@nestjs/common';

import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';
import { AmenityRepository } from '@/modules/amenity/repository/amenity.repository';
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
}
