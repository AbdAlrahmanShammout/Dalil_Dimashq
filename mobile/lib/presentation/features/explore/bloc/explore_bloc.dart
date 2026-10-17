import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
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
  }

  final SearchPlacesUseCase _searchPlaces;

  Future<void> _onStarted(
    ExploreStarted event,
    Emitter<ExploreState> emit,
  ) async {
    await _search(emit, state.query, state.category);
  }

  Future<void> _onQueryChanged(
    ExploreQueryChanged event,
    Emitter<ExploreState> emit,
  ) async {
    emit(state.copyWith(query: event.query, clearError: true));
    await _search(emit, event.query, state.category);
  }

  Future<void> _onCategorySelected(
    ExploreCategorySelected event,
    Emitter<ExploreState> emit,
  ) async {
    emit(state.copyWith(category: event.category, clearError: true));
    await _search(emit, state.query, event.category);
  }

  Future<void> _search(
    Emitter<ExploreState> emit,
    String query,
    PlaceCategory category,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    final result = await _searchPlaces(
      PlaceSearchQuery(text: query, category: category, limit: 20),
    );
    result.fold(
      (failure) =>
          emit(state.copyWith(isLoading: false, errorMessage: failure.message)),
      (page) => emit(
        state.copyWith(
          isLoading: false,
          places: page.places,
          counts: page.counts,
          clearError: true,
        ),
      ),
    );
  }
}
