import { Injectable } from '@nestjs/common';

import { HourSeasonName, PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';
import { PlaceHourRepository } from '@/modules/place-hour/repository/place-hour.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PlaceHourPrismaRepository extends PlaceHourRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listByPlace(
    placeId: string,
    season: HourSeasonName = 'regular',
  ): Promise<PlaceHourEntity[]> {
    const rows = await this.prisma.placeHour.findMany({
      where: { placeId, season },
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
          season: row.season,
        }),
    );
  }

  async isRamadan(now: Date): Promise<boolean> {
    const count = await this.prisma.ramadanSeason.count({
      where: { startsAt: { lte: now }, endsAt: { gt: now } },
    });
    return count > 0;
  }
}
