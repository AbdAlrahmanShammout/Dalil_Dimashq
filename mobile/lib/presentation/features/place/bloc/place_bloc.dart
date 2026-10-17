import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_event.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class PlaceBloc extends Bloc<PlaceEvent, PlaceState> {
  PlaceBloc(this._getPlace) : super(const PlaceState()) {
    on<PlaceRequested>(_onRequested);
  }

  final GetPlaceUseCase _getPlace;

  Future<void> _onRequested(
    PlaceRequested event,
    Emitter<PlaceState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    final result = await _getPlace(event.id);
    result.fold(
      (failure) =>
          emit(state.copyWith(isLoading: false, errorMessage: failure.message)),
      (place) => emit(
        state.copyWith(isLoading: false, place: place, clearError: true),
      ),
    );
  }
}
