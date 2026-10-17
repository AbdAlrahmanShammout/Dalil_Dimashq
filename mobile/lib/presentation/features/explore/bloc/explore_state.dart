import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';

class ExploreState {
  const ExploreState({
    this.query = '',
    this.category = PlaceCategory.all,
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
  final List<PlaceSummary> places;
  final PlaceCategoryCounts counts;
  final bool isLoading;
  final bool isLoadingMore;
  final int total;
  final String? errorMessage;

  bool get hasMore => places.length < total;

  ExploreState copyWith({
    String? query,
    PlaceCategory? category,
    List<PlaceSummary>? places,
    PlaceCategoryCounts? counts,
    bool? isLoading,
    bool? isLoadingMore,
    int? total,
    String? errorMessage,
    bool clearError = false,
  }) {
    return ExploreState(
      query: query ?? this.query,
      category: category ?? this.category,
      places: places ?? this.places,
      counts: counts ?? this.counts,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      total: total ?? this.total,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}
