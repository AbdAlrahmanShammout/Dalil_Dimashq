import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';

abstract class BookingDetailsEvent {
  const BookingDetailsEvent();
}

class BookingDetailsStarted extends BookingDetailsEvent {
  const BookingDetailsStarted(this.booking);

  final BookingSummary booking;
}

class BookingDetailsState {
  const BookingDetailsState({this.booking, this.placeName});

  final BookingSummary? booking;
  final String? placeName;
}

@injectable
class BookingDetailsBloc
    extends Bloc<BookingDetailsEvent, BookingDetailsState> {
  BookingDetailsBloc(this._getPlace) : super(const BookingDetailsState()) {
    on<BookingDetailsStarted>(_onStarted);
  }

  final GetPlaceUseCase _getPlace;

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
}
