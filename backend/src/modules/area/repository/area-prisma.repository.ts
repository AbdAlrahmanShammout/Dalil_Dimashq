import { Injectable } from '@nestjs/common';

import { AreaEntity } from '@/modules/area/entity/area.entity';
import { AreaMapper } from '@/modules/area/mapper/area.mapper';
import { AreaRepository } from '@/modules/area/repository/area.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class AreaPrismaRepository extends AreaRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async list(): Promise<AreaEntity[]> {
    const rows = await this.prisma.area.findMany({ orderBy: { nameEn: 'asc' } });
    return rows.map((row) => AreaMapper.toEntity(row));
  }

  async findById(id: string): Promise<AreaEntity | null> {
    const row = await this.prisma.area.findUnique({ where: { id } });
    return row ? AreaMapper.toEntity(row) : null;
  }
}
