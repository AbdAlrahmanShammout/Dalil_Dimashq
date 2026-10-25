import { Injectable } from '@nestjs/common';

import { AreaEntity } from '@/modules/area/entity/area.entity';
import { AreaMapper } from '@/modules/area/mapper/area.mapper';
import { AreaRepository, SaveAreaInput } from '@/modules/area/repository/area.repository';
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

  override async create(input: SaveAreaInput): Promise<AreaEntity> {
    const row = await this.prisma.area.create({ data: input });
    return AreaMapper.toEntity(row);
  }

  override async update(id: string, input: SaveAreaInput): Promise<AreaEntity | null> {
    const existing = await this.prisma.area.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const row = await this.prisma.area.update({ where: { id }, data: input });
    return AreaMapper.toEntity(row);
  }

  override async delete(id: string): Promise<boolean> {
    const result = await this.prisma.area.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
