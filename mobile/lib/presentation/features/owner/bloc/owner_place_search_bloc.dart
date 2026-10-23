import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_by_name_use_case.dart';

abstract class OwnerPlaceSearchEvent {
  const OwnerPlaceSearchEvent();
}

class OwnerPlaceSearchRequested extends OwnerPlaceSearchEvent {
  const OwnerPlaceSearchRequested(this.name);

  final String name;
}

class OwnerPlaceSearchState {
  const OwnerPlaceSearchState({
    this.places = const <OwnedPlace>[],
    this.filter = '',
  });

  final List<OwnedPlace> places;
  final String filter;
}

@injectable
class OwnerPlaceSearchBloc
    extends Bloc<OwnerPlaceSearchEvent, OwnerPlaceSearchState> {
  OwnerPlaceSearchBloc(this._search) : super(const OwnerPlaceSearchState()) {
    on<OwnerPlaceSearchRequested>(_onRequested);
  }

  final SearchPlacesByNameUseCase _search;

  Future<void> _onRequested(
    OwnerPlaceSearchRequested event,
    Emitter<OwnerPlaceSearchState> emit,
  ) async {
    final Either<Failure, List<OwnedPlace>> result = await _search(event.name);
    result.fold((Failure failure) {}, (List<OwnedPlace> places) {
      emit(OwnerPlaceSearchState(places: places, filter: event.name));
    });
  }
}
