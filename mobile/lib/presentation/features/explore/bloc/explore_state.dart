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
    this.errorMessage,
  });

  final String query;
  final PlaceCategory category;
  final List<PlaceSummary> places;
  final PlaceCategoryCounts counts;
  final bool isLoading;
  final String? errorMessage;

  ExploreState copyWith({
    String? query,
    PlaceCategory? category,
    List<PlaceSummary>? places,
    PlaceCategoryCounts? counts,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return ExploreState(
      query: query ?? this.query,
      category: category ?? this.category,
      places: places ?? this.places,
      counts: counts ?? this.counts,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}
