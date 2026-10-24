import { BaseEntity } from '@/common/base/base.entity';
import { AreaEntity } from '@/modules/area/entity/area.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceZodType } from '@/modules/place/zod/place.zod';

export class PlaceEntity extends BaseEntity {
  nameAr!: string;
  nameEn!: string;
  type!: PlaceType;
  status!: PlaceStatus;
  areaId!: string;
  addressAr!: string | null;
  addressEn!: string | null;
  latitude!: number | null;
  longitude!: number | null;
  isFeatured!: boolean;
  starValue!: number | null;
  starSource!: string | null;
  area?: AreaEntity;

  constructor(data: PlaceZodType) {
    super();
    Object.assign(this, data);
  }
}
