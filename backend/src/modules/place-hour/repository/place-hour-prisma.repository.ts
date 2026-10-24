import { Injectable } from '@nestjs/common';

import { PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';
import { PlaceHourRepository } from '@/modules/place-hour/repository/place-hour.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PlaceHourPrismaRepository extends PlaceHourRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listByPlace(placeId: string): Promise<PlaceHourEntity[]> {
    const rows = await this.prisma.placeHour.findMany({
      where: { placeId },
      orderBy: [{ dayOfWeek: 'asc' }, { opensAt: 'asc' }],
    });
    return rows.map(
      (row) =>
        new PlaceHourEntity({
          id: row.id,
          placeId: row.placeId,
          dayOfWeek: row.dayOfWeek,
          opensAt: row.opensAt,
          closesAt: row.closesAt,
        }),
    );
  }
}
