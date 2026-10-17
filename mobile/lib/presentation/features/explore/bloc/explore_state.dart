import 'package:dalil_dimashq/domain/entities/place_summary.dart';

class ExploreState {
  const ExploreState({
    this.query = '',
    this.places = const <PlaceSummary>[],
    this.isLoading = false,
    this.errorMessage,
  });

  final String query;
  final List<PlaceSummary> places;
  final bool isLoading;
  final String? errorMessage;

  ExploreState copyWith({
    String? query,
    List<PlaceSummary>? places,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return ExploreState(
      query: query ?? this.query,
      places: places ?? this.places,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}
