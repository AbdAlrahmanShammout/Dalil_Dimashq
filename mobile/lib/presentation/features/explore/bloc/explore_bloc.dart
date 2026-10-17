import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_event.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class ExploreBloc extends Bloc<ExploreEvent, ExploreState> {
  ExploreBloc(this._searchPlaces) : super(const ExploreState()) {
    on<ExploreStarted>(_onStarted);
    on<ExploreQueryChanged>(_onQueryChanged);
    on<ExploreCategorySelected>(_onCategorySelected);
    on<ExploreLoadMore>(_onLoadMore);
  }

  final SearchPlacesUseCase _searchPlaces;

  Future<void> _onStarted(
    ExploreStarted event,
    Emitter<ExploreState> emit,
  ) async {
    await _search(emit, state.query, state.category, offset: 0, append: false);
  }

  Future<void> _onQueryChanged(
    ExploreQueryChanged event,
    Emitter<ExploreState> emit,
  ) async {
    emit(state.copyWith(query: event.query, clearError: true));
    await _search(emit, event.query, state.category, offset: 0, append: false);
  }

  Future<void> _onCategorySelected(
    ExploreCategorySelected event,
    Emitter<ExploreState> emit,
  ) async {
    emit(state.copyWith(category: event.category, clearError: true));
    await _search(emit, state.query, event.category, offset: 0, append: false);
  }

  Future<void> _onLoadMore(
    ExploreLoadMore event,
    Emitter<ExploreState> emit,
  ) async {
    if (!state.hasMore || state.isLoading || state.isLoadingMore) {
      return;
    }
    await _search(
      emit,
      state.query,
      state.category,
      offset: state.places.length,
      append: true,
    );
  }

  Future<void> _search(
    Emitter<ExploreState> emit,
    String query,
    PlaceCategory category, {
    required int offset,
    required bool append,
  }) async {
    emit(
      state.copyWith(
        isLoading: !append,
        isLoadingMore: append,
        clearError: true,
      ),
    );
    final result = await _searchPlaces(
      PlaceSearchQuery(
        text: query,
        category: category,
        limit: 20,
        offset: offset,
      ),
    );
    result.fold(
      (failure) => emit(
        state.copyWith(
          isLoading: false,
          isLoadingMore: false,
          errorMessage: failure.message,
        ),
      ),
      (page) => emit(
        state.copyWith(
          isLoading: false,
          isLoadingMore: false,
          places: append
              ? <PlaceSummary>[...state.places, ...page.places]
              : page.places,
          counts: page.counts,
          total: page.total,
          clearError: true,
        ),
      ),
    );
  }
}
