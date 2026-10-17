// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_summary_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PlaceSummaryDto _$PlaceSummaryDtoFromJson(Map<String, dynamic> json) =>
    PlaceSummaryDto(
      id: json['id'] as String,
      type: json['type'] as String,
      nameAr: json['name_ar'] as String,
      nameEn: json['name_en'] as String?,
      areaNameAr: json['area_name_ar'] as String?,
      areaNameEn: json['area_name_en'] as String?,
      phones:
          (json['phones'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      stars: (json['stars'] as num?)?.toInt(),
      starSource: json['star_source'] as String?,
      isFeatured: json['is_featured'] as bool? ?? false,
      coverPath: json['cover_path'] as String?,
      hours:
          (json['hours'] as List<dynamic>?)
              ?.map((e) => PlaceHourDto.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const <PlaceHourDto>[],
      latitude: (json['lat'] as num?)?.toDouble(),
      longitude: (json['lon'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$PlaceSummaryDtoToJson(PlaceSummaryDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'name_ar': instance.nameAr,
      'name_en': instance.nameEn,
      'area_name_ar': instance.areaNameAr,
      'area_name_en': instance.areaNameEn,
      'phones': instance.phones,
      'stars': instance.stars,
      'star_source': instance.starSource,
      'is_featured': instance.isFeatured,
      'cover_path': instance.coverPath,
      'hours': instance.hours.map((e) => e.toJson()).toList(),
      'lat': instance.latitude,
      'lon': instance.longitude,
    };
