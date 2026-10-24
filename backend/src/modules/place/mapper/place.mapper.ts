import { AreaMapper } from '@/modules/area/mapper/area.mapper';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceDetailsSchema } from '@/modules/place/types/place-details-schema.type';

export class PlaceMapper {
  static toEntity(row: PlaceDetailsSchema): PlaceEntity {
    const place = new PlaceEntity({
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: null,
      nameAr: row.nameAr,
      nameEn: row.nameEn,
      type: row.type as PlaceType,
      status: row.status as PlaceStatus,
      areaId: row.areaId,
      addressAr: row.addressAr,
      addressEn: row.addressEn,
      latitude: row.latitude,
      longitude: row.longitude,
      isFeatured: row.isFeatured,
      starValue: row.starValue,
      starSource: row.starSource,
      phone: row.phone,
      website: row.website,
      email: row.email,
      facebook: row.facebook,
      instagram: row.instagram,
    });
    if (row.area) {
      place.area = AreaMapper.toEntity(row.area);
    }
    return place;
  }
}
