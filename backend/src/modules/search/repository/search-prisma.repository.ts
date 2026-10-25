import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PlaceMapper } from '@/modules/place/mapper/place.mapper';
import { placeDetailsInclude } from '@/modules/place/types/place-details.include';
import { PlaceSearchQuery } from '@/modules/search/defs/place-search-query';
import {
  MapPoint,
  PlaceMapQuery,
  PlaceSearchPage,
  SearchRepository,
} from '@/modules/search/repository/search.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class SearchPrismaRepository extends SearchRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async search(query: PlaceSearchQuery): Promise<PlaceSearchPage> {
    const where = this.where(query);
    const order =
      query.sort === 'name'
        ? Prisma.sql`p."nameEn" ASC`
        : Prisma.sql`(
            (CASE WHEN p.phone IS NOT NULL AND p.phone <> '' THEN 1 ELSE 0 END) +
            (CASE WHEN p.website IS NOT NULL AND p.website <> '' THEN 1 ELSE 0 END) +
            (CASE WHEN p.email IS NOT NULL AND p.email <> '' THEN 1 ELSE 0 END) +
            (CASE WHEN p.facebook IS NOT NULL AND p.facebook <> '' THEN 1 ELSE 0 END) +
            (CASE WHEN p.instagram IS NOT NULL AND p.instagram <> '' THEN 1 ELSE 0 END) +
            (CASE WHEN p."addressAr" IS NOT NULL AND p."addressAr" <> '' THEN 1 ELSE 0 END) +
            (CASE WHEN p.latitude IS NOT NULL THEN 1 ELSE 0 END) +
            (CASE WHEN p."starValue" IS NOT NULL THEN 1 ELSE 0 END)
          ) DESC, p."nameEn" ASC`;
    const idRows = await this.prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT p.id FROM "Place" p
      WHERE ${where}
      ORDER BY ${order}
      LIMIT ${query.limit} OFFSET ${query.offset}
    `);
    const totalRows = await this.prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
      SELECT COUNT(*)::bigint AS count FROM "Place" p WHERE ${where}
    `);
    const ids = idRows.map((row) => row.id);
    const rows =
      ids.length === 0
        ? []
        : await this.prisma.place.findMany({
            where: { id: { in: ids } },
            include: placeDetailsInclude,
          });
    const byId = new Map(rows.map((row) => [row.id, PlaceMapper.toEntity(row)]));
    return {
      items: ids.flatMap((id) => {
        const place = byId.get(id);
        return place ? [place] : [];
      }),
      total: Number(totalRows[0]?.count ?? 0),
      limit: query.limit,
      offset: query.offset,
    };
  }

  async listMap(query: PlaceMapQuery): Promise<MapPoint[]> {
    const located = Prisma.sql`${this.where(query)} AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL`;
    const order =
      query.sort === 'near' && query.latitude !== undefined && query.longitude !== undefined
        ? Prisma.sql`(
            6371 * acos(LEAST(1::float8, GREATEST(-1::float8,
              cos(radians(${query.latitude})) * cos(radians(p.latitude))
              * cos(radians(p.longitude) - radians(${query.longitude}))
              + sin(radians(${query.latitude})) * sin(radians(p.latitude))
            )))
          ) ASC`
        : Prisma.sql`p."nameEn" ASC`;
    return this.prisma.$queryRaw<MapPoint[]>(Prisma.sql`
      SELECT p.id, p.latitude, p.longitude, p.type::text AS type
      FROM "Place" p
      WHERE ${located}
      ORDER BY ${order}
    `);
  }

  private where(query: {
    text?: string;
    type?: PlaceSearchQuery['type'];
    areaId?: string;
    minimumStars?: number;
    hasPhone?: boolean;
  }): Prisma.Sql {
    const filters: Prisma.Sql[] = [Prisma.sql`p.status <> 'hidden'`];
    if (query.text) {
      const pattern = `%${query.text}%`;
      filters.push(Prisma.sql`(
        p."nameAr" ILIKE ${pattern} OR p."nameEn" ILIKE ${pattern}
        OR COALESCE(p."addressAr", '') ILIKE ${pattern}
        OR COALESCE(p."addressEn", '') ILIKE ${pattern}
      )`);
    }
    if (query.type) {
      filters.push(Prisma.sql`p.type = CAST(${query.type} AS "PlaceType")`);
    }
    if (query.areaId) {
      filters.push(Prisma.sql`p."areaId" = ${query.areaId}`);
    }
    if (query.minimumStars !== undefined) {
      filters.push(Prisma.sql`p."starValue" >= ${query.minimumStars}`);
    }
    if (query.hasPhone) {
      filters.push(Prisma.sql`p.phone IS NOT NULL AND p.phone <> ''`);
    }
    return Prisma.join(filters, ' AND ');
  }
}
