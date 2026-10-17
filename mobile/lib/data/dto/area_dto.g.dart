// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'area_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AreaDto _$AreaDtoFromJson(Map<String, dynamic> json) => AreaDto(
  id: (json['id'] as num).toInt(),
  nameAr: json['name_ar'] as String,
  nameEn: json['name_en'] as String,
);

Map<String, dynamic> _$AreaDtoToJson(AreaDto instance) => <String, dynamic>{
  'id': instance.id,
  'name_ar': instance.nameAr,
  'name_en': instance.nameEn,
};
