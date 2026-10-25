import { Injectable } from '@nestjs/common';

import { HourSeasonName, PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';
import {
  PlaceHourRepository,
  RegularHourPeriod,
} from '@/modules/place-hour/repository/place-hour.repository';
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

  override async replaceSeason(
    placeId: string,
    season: HourSeasonName,
    periods: RegularHourPeriod[],
  ): Promise<boolean> {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
      select: { id: true },
    });
    if (!place) {
      return false;
    }
    await this.prisma.$transaction([
      this.prisma.placeHour.deleteMany({ where: { placeId, season } }),
      this.prisma.placeHour.createMany({
        data: periods.map((period) => ({
          placeId,
          dayOfWeek: period.dayOfWeek,
          opensAt: period.opensAt,
          closesAt: period.closesAt,
          season,
        })),
      }),
    ]);
    return true;
  }

  override async replaceRegular(placeId: string, periods: RegularHourPeriod[]): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.placeHour.deleteMany({ where: { placeId, season: 'regular' } }),
      this.prisma.placeHour.createMany({
        data: periods.map((period) => ({
          placeId,
          dayOfWeek: period.dayOfWeek,
          opensAt: period.opensAt,
          closesAt: period.closesAt,
          season: 'regular' as const,
        })),
      }),
    ]);
  }
}
