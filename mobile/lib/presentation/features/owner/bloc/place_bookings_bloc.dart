import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_place_bookings_use_case.dart';

abstract class PlaceBookingsEvent {
  const PlaceBookingsEvent();
}

class PlaceBookingsStarted extends PlaceBookingsEvent {
  const PlaceBookingsStarted(this.placeId);

  final String placeId;
}

class PlaceBookingsState {
  const PlaceBookingsState({this.bookings = const <OwnerBooking>[]});

  final List<OwnerBooking> bookings;
}

@injectable
class PlaceBookingsBloc extends Bloc<PlaceBookingsEvent, PlaceBookingsState> {
  PlaceBookingsBloc(this._list) : super(const PlaceBookingsState()) {
    on<PlaceBookingsStarted>(_onStarted);
  }

  final ListPlaceBookingsUseCase _list;

  Future<void> _onStarted(
    PlaceBookingsStarted event,
    Emitter<PlaceBookingsState> emit,
  ) async {
    final Either<Failure, List<OwnerBooking>> result = await _list(event.placeId);
    result.fold((Failure failure) {}, (List<OwnerBooking> bookings) {
      emit(PlaceBookingsState(bookings: bookings));
    });
  }
}
