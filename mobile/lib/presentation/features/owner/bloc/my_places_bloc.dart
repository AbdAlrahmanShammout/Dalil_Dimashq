import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_owned_places_use_case.dart';

abstract class MyPlacesEvent {
  const MyPlacesEvent();
}

class MyPlacesStarted extends MyPlacesEvent {
  const MyPlacesStarted();
}

class MyPlacesState {
  const MyPlacesState({this.places = const <OwnedPlace>[]});

  final List<OwnedPlace> places;
}

@injectable
class MyPlacesBloc extends Bloc<MyPlacesEvent, MyPlacesState> {
  MyPlacesBloc(this._list) : super(const MyPlacesState()) {
    on<MyPlacesStarted>(_onStarted);
  }

  final ListOwnedPlacesUseCase _list;

  Future<void> _onStarted(
    MyPlacesStarted event,
    Emitter<MyPlacesState> emit,
  ) async {
    final Either<Failure, List<OwnedPlace>> result = await _list();
    result.fold((Failure failure) {}, (List<OwnedPlace> places) {
      emit(MyPlacesState(places: places));
    });
  }
}
