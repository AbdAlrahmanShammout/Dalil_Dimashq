import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_ban_use_case.dart';

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
    this.ban,
  });

  final bool isAvailable;
  final bool hasSession;
  final BookingBan? ban;

  bool get canBook => isAvailable && ban == null;
}

@injectable
class BookingGateBloc extends Bloc<BookingGateEvent, BookingGateState> {
  BookingGateBloc(this._loadAvailability, this._hasSession, this._loadBan)
    : super(const BookingGateState()) {
    on<BookingGateStarted>(_onStarted);
  }

  final LoadBookingAvailabilityUseCase _loadAvailability;
  final HasSessionUseCase _hasSession;
  final LoadBookingBanUseCase _loadBan;

  Future<void> _onStarted(
    BookingGateStarted event,
    Emitter<BookingGateState> emit,
  ) async {
    final Either<Failure, BookingAvailability> result = await _loadAvailability(
      event.placeId,
    );
    final BookingBan? ban = _hasSession()
        ? (await _loadBan(DateTime.now())).fold(
            (Failure failure) => null,
            (BookingBan? value) => value,
          )
        : null;
    result.fold((Failure failure) {}, (BookingAvailability availability) {
      emit(
        BookingGateState(
          isAvailable: availability.isAvailable,
          hasSession: _hasSession(),
          ban: ban,
        ),
      );
    });
  }
}
