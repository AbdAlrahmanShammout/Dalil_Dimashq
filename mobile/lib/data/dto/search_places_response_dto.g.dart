// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_places_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SearchPlacesResponseDto _$SearchPlacesResponseDtoFromJson(
  Map<String, dynamic> json,
) => SearchPlacesResponseDto(
  places: (json['places'] as List<dynamic>)
      .map((e) => PlaceSummaryDto.fromJson(e as Map<String, dynamic>))
      .toList(),
  total: (json['total'] as num).toInt(),
  countAll: (json['count_all'] as num).toInt(),
  countHotels: (json['count_hotels'] as num).toInt(),
  countRestaurants: (json['count_restaurants'] as num).toInt(),
  countCafes: (json['count_cafes'] as num).toInt(),
);

Map<String, dynamic> _$SearchPlacesResponseDtoToJson(
  SearchPlacesResponseDto instance,
) => <String, dynamic>{
  'places': instance.places.map((e) => e.toJson()).toList(),
  'total': instance.total,
  'count_all': instance.countAll,
  'count_hotels': instance.countHotels,
  'count_restaurants': instance.countRestaurants,
  'count_cafes': instance.countCafes,
};
