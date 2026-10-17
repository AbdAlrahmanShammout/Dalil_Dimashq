import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:json_annotation/json_annotation.dart';

part 'search_places_request_dto.g.dart';

@JsonSerializable(includeIfNull: false)
class SearchPlacesRequestDto {
  const SearchPlacesRequestDto({
    this.pQuery,
    this.pCategory,
    this.pAreaId,
    this.pMinStars,
    this.pHasPhone,
    required this.pSort,
    required this.pLimit,
    required this.pOffset,
  });

  factory SearchPlacesRequestDto.fromQuery(PlaceSearchQuery query) {
    return SearchPlacesRequestDto(
      pQuery: _blankToNull(query.text),
      pCategory: query.category == PlaceCategory.all
          ? null
          : query.category.name,
      pAreaId: query.areaId,
      pMinStars: query.minStars,
      pHasPhone: query.hasPhone ? true : null,
      pSort: query.sort.name,
      pLimit: query.limit,
      pOffset: query.offset,
    );
  }

  factory SearchPlacesRequestDto.fromJson(Map<String, dynamic> json) =>
      _$SearchPlacesRequestDtoFromJson(json);

  @JsonKey(name: 'p_query')
  final String? pQuery;
  @JsonKey(name: 'p_category')
  final String? pCategory;
  @JsonKey(name: 'p_area_id')
  final int? pAreaId;
  @JsonKey(name: 'p_min_stars')
  final int? pMinStars;
  @JsonKey(name: 'p_has_phone')
  final bool? pHasPhone;
  @JsonKey(name: 'p_sort')
  final String pSort;
  @JsonKey(name: 'p_limit')
  final int pLimit;
  @JsonKey(name: 'p_offset')
  final int pOffset;

  Map<String, dynamic> toJson() => _$SearchPlacesRequestDtoToJson(this);
}

String? _blankToNull(String? value) {
  if (value == null || value.trim().isEmpty) {
    return null;
  }
  return value.trim();
}
