import { Injectable } from '@nestjs/common';

import { PlacePhotoEntity, PlacePhotoRole } from '@/modules/place-photo/entity/place-photo.entity';
import { PlacePhotoRepository } from '@/modules/place-photo/repository/place-photo.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PlacePhotoPrismaRepository extends PlacePhotoRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listVisible(placeId: string): Promise<PlacePhotoEntity[]> {
    const rows = await this.prisma.placePhoto.findMany({
      where: { placeId, hidden: false },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map(
      (row) =>
        new PlacePhotoEntity({
          id: row.id,
          objectKey: row.objectKey,
          role: row.role as PlacePhotoRole,
          hidden: row.hidden,
          sortOrder: row.sortOrder,
        }),
    );
  }
}
