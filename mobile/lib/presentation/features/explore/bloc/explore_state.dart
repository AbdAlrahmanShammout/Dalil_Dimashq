import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';

class ExploreState {
  const ExploreState({
    this.query = '',
    this.category = PlaceCategory.all,
    this.areaId,
    this.minStars,
    this.hasPhone = false,
    this.sort = PlaceSort.completeness,
    this.areas = const <Area>[],
    this.places = const <PlaceSummary>[],
    this.counts = const PlaceCategoryCounts(
      all: 0,
      hotels: 0,
      restaurants: 0,
      cafes: 0,
    ),
    this.isLoading = false,
    this.isLoadingMore = false,
    this.total = 0,
    this.errorMessage,
  });

  final String query;
  final PlaceCategory category;
  final int? areaId;
  final int? minStars;
  final bool hasPhone;
  final PlaceSort sort;
  final List<Area> areas;
  final List<PlaceSummary> places;
  final PlaceCategoryCounts counts;
  final bool isLoading;
  final bool isLoadingMore;
  final int total;
  final String? errorMessage;

  bool get hasMore => places.length < total;

  int get activeFilterCount {
    var count = 0;
    if (category != PlaceCategory.all) {
      count += 1;
    }
    if (areaId != null) {
      count += 1;
    }
    if (minStars != null) {
      count += 1;
    }
    if (hasPhone) {
      count += 1;
    }
    if (sort != PlaceSort.completeness) {
      count += 1;
    }
    return count;
  }

  ExploreState copyWith({
    String? query,
    PlaceCategory? category,
    int? areaId,
    int? minStars,
    bool? hasPhone,
    PlaceSort? sort,
    List<Area>? areas,
    List<PlaceSummary>? places,
    PlaceCategoryCounts? counts,
    bool? isLoading,
    bool? isLoadingMore,
    int? total,
    String? errorMessage,
    bool clearError = false,
    bool clearArea = false,
    bool clearStars = false,
  }) {
    return ExploreState(
      query: query ?? this.query,
      category: category ?? this.category,
      areaId: clearArea ? null : areaId ?? this.areaId,
      minStars: clearStars ? null : minStars ?? this.minStars,
      hasPhone: hasPhone ?? this.hasPhone,
      sort: sort ?? this.sort,
      areas: areas ?? this.areas,
      places: places ?? this.places,
      counts: counts ?? this.counts,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      total: total ?? this.total,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}
