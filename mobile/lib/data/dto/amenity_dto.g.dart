// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'amenity_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AmenityDto _$AmenityDtoFromJson(Map<String, dynamic> json) => AmenityDto(
  code: json['code'] as String,
  nameAr: json['name_ar'] as String,
  nameEn: json['name_en'] as String,
);

Map<String, dynamic> _$AmenityDtoToJson(AmenityDto instance) =>
    <String, dynamic>{
      'code': instance.code,
      'name_ar': instance.nameAr,
      'name_en': instance.nameEn,
    };

PlaceAmenityDto _$PlaceAmenityDtoFromJson(Map<String, dynamic> json) =>
    PlaceAmenityDto(amenity: json['amenity'] as String);

Map<String, dynamic> _$PlaceAmenityDtoToJson(PlaceAmenityDto instance) =>
    <String, dynamic>{'amenity': instance.amenity};
