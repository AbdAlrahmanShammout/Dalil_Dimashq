import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';

abstract class BookingGateEvent {
  const BookingGateEvent();
}

class BookingGateStarted extends BookingGateEvent {
  const BookingGateStarted(this.placeId);

  final String placeId;
}

class BookingGateState {
  const BookingGateState({
    this.isAvailable = false,
    this.hasSession = false,
  });

  final bool isAvailable;
  final bool hasSession;

  bool get canBook => isAvailable;
}

@injectable
class BookingGateBloc extends Bloc<BookingGateEvent, BookingGateState> {
  BookingGateBloc(this._loadAvailability, this._hasSession)
    : super(const BookingGateState()) {
    on<BookingGateStarted>(_onStarted);
  }

  final LoadBookingAvailabilityUseCase _loadAvailability;
  final HasSessionUseCase _hasSession;

  Future<void> _onStarted(
    BookingGateStarted event,
    Emitter<BookingGateState> emit,
  ) async {
    final Either<Failure, BookingAvailability> result = await _loadAvailability(
      event.placeId,
    );
    result.fold((Failure failure) {}, (BookingAvailability availability) {
      emit(
        BookingGateState(
          isAvailable: availability.isAvailable,
          hasSession: _hasSession(),
        ),
      );
    });
  }
}
