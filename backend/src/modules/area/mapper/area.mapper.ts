import { AreaEntity } from '@/modules/area/entity/area.entity';
import { AreaDetailsSchema } from '@/modules/area/types/area-details-schema.type';

export class AreaMapper {
  static toEntity(row: AreaDetailsSchema): AreaEntity {
    return new AreaEntity({
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: null,
      nameAr: row.nameAr,
      nameEn: row.nameEn,
    });
  }
}
