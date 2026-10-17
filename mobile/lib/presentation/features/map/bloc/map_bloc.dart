import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

class MapState {
  const MapState({this.places = const <PlaceSummary>[]});

  final List<PlaceSummary> places;

  MapState copyWith({List<PlaceSummary>? places}) {
    return MapState(places: places ?? this.places);
  }
}

class MapStarted {
  const MapStarted();
}

@injectable
class MapBloc extends Bloc<MapStarted, MapState> {
  MapBloc(this._searchPlaces) : super(const MapState()) {
    on<MapStarted>(_onStarted);
  }

  final SearchPlacesUseCase _searchPlaces;

  Future<void> _onStarted(MapStarted event, Emitter<MapState> emit) async {
    final result = await _searchPlaces(const PlaceSearchQuery(limit: 100));
    result.fold((_) {}, (page) => emit(state.copyWith(places: page.places)));
  }
}
