import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/cancel_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/reply_fake_report_use_case.dart';
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

class FakeReportReplySubmitted extends BookingDetailsEvent {
  const FakeReportReplySubmitted(this.reply);

  final String reply;
}

class BookingDetailsState {
  const BookingDetailsState({
    this.booking,
    this.placeName,
    this.reportId,
    this.isReplySent = false,
  });

  final BookingSummary? booking;
  final String? placeName;
  final int? reportId;
  final bool isReplySent;
}

@injectable
class BookingDetailsBloc
    extends Bloc<BookingDetailsEvent, BookingDetailsState> {
  BookingDetailsBloc(this._getPlace, this._cancel, this._reply)
    : super(const BookingDetailsState()) {
    on<BookingDetailsStarted>(_onStarted);
    on<BookingCancelled>(_onCancelled);
    on<FakeReportReplySubmitted>(_onReply);
  }

  final GetPlaceUseCase _getPlace;
  final CancelBookingUseCase _cancel;
  final ReplyFakeReportUseCase _reply;

  Future<void> _onStarted(
    BookingDetailsStarted event,
    Emitter<BookingDetailsState> emit,
  ) async {
    int? reportId;
    if (event.booking.reported) {
      final Either<Failure, int?> report = await _reply.reportId(
        event.booking.id,
      );
      reportId = report.fold((Failure failure) => null, (int? value) => value);
    }
    emit(BookingDetailsState(booking: event.booking, reportId: reportId));
    final String? placeId = event.booking.placeId;
    if (placeId == null) {
      return;
    }
    final Either<Failure, PlaceDetail> result = await _getPlace(placeId);
    result.fold((Failure failure) {}, (PlaceDetail place) {
      emit(
        BookingDetailsState(
          booking: event.booking,
          placeName: place.nameAr,
          reportId: state.reportId,
        ),
      );
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
          reportId: state.reportId,
        ),
      );
    });
  }

  Future<void> _onReply(
    FakeReportReplySubmitted event,
    Emitter<BookingDetailsState> emit,
  ) async {
    final int? reportId = state.reportId;
    if (reportId == null || event.reply.trim().isEmpty) {
      return;
    }
    final Either<Failure, void> result = await _reply.reply(
      reportId: reportId,
      reply: event.reply.trim(),
    );
    result.fold((Failure failure) {}, (_) {
      emit(
        BookingDetailsState(
          booking: state.booking,
          placeName: state.placeName,
          reportId: reportId,
          isReplySent: true,
        ),
      );
    });
  }
}
