// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_places_request_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SearchPlacesRequestDto _$SearchPlacesRequestDtoFromJson(
  Map<String, dynamic> json,
) => SearchPlacesRequestDto(
  pQuery: json['p_query'] as String?,
  pCategory: json['p_category'] as String?,
  pAreaId: (json['p_area_id'] as num?)?.toInt(),
  pMinStars: (json['p_min_stars'] as num?)?.toInt(),
  pHasPhone: json['p_has_phone'] as bool?,
  pSort: json['p_sort'] as String,
  pLimit: (json['p_limit'] as num).toInt(),
  pOffset: (json['p_offset'] as num).toInt(),
);

Map<String, dynamic> _$SearchPlacesRequestDtoToJson(
  SearchPlacesRequestDto instance,
) => <String, dynamic>{
  'p_query': ?instance.pQuery,
  'p_category': ?instance.pCategory,
  'p_area_id': ?instance.pAreaId,
  'p_min_stars': ?instance.pMinStars,
  'p_has_phone': ?instance.pHasPhone,
  'p_sort': instance.pSort,
  'p_limit': instance.pLimit,
  'p_offset': instance.pOffset,
};
