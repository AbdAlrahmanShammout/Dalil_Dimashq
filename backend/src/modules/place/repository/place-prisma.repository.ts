import { Injectable } from '@nestjs/common';
import { PlaceStatus } from '@prisma/client';

import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceMapper } from '@/modules/place/mapper/place.mapper';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { placeDetailsInclude } from '@/modules/place/types/place-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

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
}
