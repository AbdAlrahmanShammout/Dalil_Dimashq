import 'package:dalil_dimashq/data/dto/place_summary_dto.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:json_annotation/json_annotation.dart';

part 'search_places_response_dto.g.dart';

@JsonSerializable(explicitToJson: true)
class SearchPlacesResponseDto {
  const SearchPlacesResponseDto({
    required this.places,
    required this.total,
    required this.countAll,
    required this.countHotels,
    required this.countRestaurants,
    required this.countCafes,
  });

  factory SearchPlacesResponseDto.fromJson(Map<String, dynamic> json) =>
      _$SearchPlacesResponseDtoFromJson(json);

  final List<PlaceSummaryDto> places;
  final int total;
  @JsonKey(name: 'count_all')
  final int countAll;
  @JsonKey(name: 'count_hotels')
  final int countHotels;
  @JsonKey(name: 'count_restaurants')
  final int countRestaurants;
  @JsonKey(name: 'count_cafes')
  final int countCafes;

  Map<String, dynamic> toJson() => _$SearchPlacesResponseDtoToJson(this);

  PlaceSearchPage toEntity() {
    return PlaceSearchPage(
      places: places.map((PlaceSummaryDto place) => place.toEntity()).toList(),
      total: total,
      counts: PlaceCategoryCounts(
        all: countAll,
        hotels: countHotels,
        restaurants: countRestaurants,
        cafes: countCafes,
      ),
    );
  }
}
