import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/cancel_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';

abstract class BookingDetailsEvent {
  const BookingDetailsEvent();
}

class BookingDetailsStarted extends BookingDetailsEvent {
  const BookingDetailsStarted(this.booking);

  final BookingSummary booking;
}

class BookingCancelled extends BookingDetailsEvent {
  const BookingCancelled();
}

class BookingDetailsState {
  const BookingDetailsState({this.booking, this.placeName});

  final BookingSummary? booking;
  final String? placeName;
}

@injectable
class BookingDetailsBloc
    extends Bloc<BookingDetailsEvent, BookingDetailsState> {
  BookingDetailsBloc(this._getPlace, this._cancel)
    : super(const BookingDetailsState()) {
    on<BookingDetailsStarted>(_onStarted);
    on<BookingCancelled>(_onCancelled);
  }

  final GetPlaceUseCase _getPlace;
  final CancelBookingUseCase _cancel;

  Future<void> _onStarted(
    BookingDetailsStarted event,
    Emitter<BookingDetailsState> emit,
  ) async {
    emit(BookingDetailsState(booking: event.booking));
    final String? placeId = event.booking.placeId;
    if (placeId == null) {
      return;
    }
    final Either<Failure, PlaceDetail> result = await _getPlace(placeId);
    result.fold((Failure failure) {}, (PlaceDetail place) {
      emit(BookingDetailsState(booking: event.booking, placeName: place.nameAr));
    });
  }

  Future<void> _onCancelled(
    BookingCancelled event,
    Emitter<BookingDetailsState> emit,
  ) async {
    final BookingSummary? booking = state.booking;
    if (booking == null) {
      return;
    }
    final Either<Failure, String> result = await _cancel(booking.id);
    result.fold((Failure failure) {}, (String status) {
      emit(
        BookingDetailsState(
          booking: booking.copyWith(status: status),
          placeName: state.placeName,
        ),
      );
    });
  }
}
