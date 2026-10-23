import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/services/booking_clock.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_event.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_state.dart';

@injectable
class BookingDraftBloc extends Bloc<BookingDraftEvent, BookingDraftState> {
  BookingDraftBloc(this._loadProfile, this._loadAvailability, this._clock)
    : super(const BookingDraftState()) {
    on<BookingDraftStarted>(_onStarted);
    on<BookingDateSelected>(_onDateSelected);
    on<BookingTimeSelected>(_onTimeSelected);
  }

  final LoadProfileUseCase _loadProfile;
  final LoadBookingAvailabilityUseCase _loadAvailability;
  final BookingClock _clock;

  Future<void> _onStarted(
    BookingDraftStarted event,
    Emitter<BookingDraftState> emit,
  ) async {
    final Either<Failure, UserProfile> profileResult = await _loadProfile();
    final UserProfile? profile = profileResult.fold(
      (Failure failure) => null,
      (UserProfile value) => value,
    );
    final BookingAvailability? availability = await _load(event.placeId);
    final List<DateTime> dates = _dates(availability);
    final DateTime? selectedDate = dates.isEmpty ? null : dates.first;
    final List<DateTime> times = _times(selectedDate, availability);
    emit(
      BookingDraftState(
        displayName: profile?.displayName ?? '',
        phone: profile?.phone ?? '',
        placeId: event.placeId,
        dates: dates,
        times: times,
        selectedDate: selectedDate,
        selectedTime: times.isEmpty ? null : times.first,
        slotMinutes: availability?.slotMinutes ?? 15,
        noticeMinutes: availability?.minimumNoticeMinutes ?? 0,
        closed: availability?.closed ?? const <BookingPeriod>[],
      ),
    );
  }

  void _onDateSelected(
    BookingDateSelected event,
    Emitter<BookingDraftState> emit,
  ) {
    emit(
      state.copyWith(
        selectedDate: event.date,
        times: bookingTimes(
          date: event.date,
          now: _clock.now(),
          slotMinutes: state.slotMinutes,
          noticeMinutes: state.noticeMinutes,
          closed: state.closed,
        ),
        clearTime: true,
      ),
    );
  }

  void _onTimeSelected(
    BookingTimeSelected event,
    Emitter<BookingDraftState> emit,
  ) {
    emit(state.copyWith(selectedTime: event.time));
  }

  Future<BookingAvailability?> _load(String? placeId) async {
    if (placeId == null) {
      return null;
    }
    final Either<Failure, BookingAvailability> result = await _loadAvailability(
      placeId,
    );
    return result.fold(
      (Failure failure) => null,
      (BookingAvailability value) => value,
    );
  }

  List<DateTime> _dates(BookingAvailability? availability) {
    if (availability == null) {
      return const <DateTime>[];
    }
    return bookingDates(
      now: _clock.now(),
      horizonDays: availability.horizonDays,
      lastDate: availability.lastDate,
    );
  }

  List<DateTime> _times(DateTime? date, BookingAvailability? availability) {
    if (date == null || availability == null) {
      return const <DateTime>[];
    }
    return bookingTimes(
      date: date,
      now: _clock.now(),
      slotMinutes: availability.slotMinutes,
      noticeMinutes: availability.minimumNoticeMinutes,
      closed: availability.closed,
    );
  }
}
