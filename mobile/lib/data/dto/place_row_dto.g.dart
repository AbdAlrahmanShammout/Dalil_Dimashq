// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_row_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PlaceRowDto _$PlaceRowDtoFromJson(Map<String, dynamic> json) => PlaceRowDto(
  id: json['id'] as String,
  type: json['type'] as String,
  nameAr: json['name_ar'] as String,
  nameEn: json['name_en'] as String?,
  areaId: (json['area_id'] as num?)?.toInt(),
  stars: (json['stars'] as num?)?.toInt(),
  tourismClass: (json['tourism_class'] as num?)?.toInt(),
);

Map<String, dynamic> _$PlaceRowDtoToJson(PlaceRowDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'name_ar': instance.nameAr,
      'name_en': instance.nameEn,
      'area_id': instance.areaId,
      'stars': instance.stars,
      'tourism_class': instance.tourismClass,
    };
