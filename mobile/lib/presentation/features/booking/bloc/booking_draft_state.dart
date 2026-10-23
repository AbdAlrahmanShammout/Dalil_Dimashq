import 'package:dalil_dimashq/domain/entities/booking_availability.dart';

class BookingDraftState {
  const BookingDraftState({
    this.displayName = '',
    this.phone = '',
    this.placeId,
    this.dates = const <DateTime>[],
    this.times = const <DateTime>[],
    this.selectedDate,
    this.selectedTime,
    this.slotMinutes = 15,
    this.noticeMinutes = 0,
    this.closed = const <BookingPeriod>[],
    this.maxParty = 1,
    this.errorCode,
    this.bookingId,
  });

  final String displayName;
  final String phone;
  final String? placeId;
  final List<DateTime> dates;
  final List<DateTime> times;
  final DateTime? selectedDate;
  final DateTime? selectedTime;
  final int slotMinutes;
  final int noticeMinutes;
  final List<BookingPeriod> closed;
  final int maxParty;
  final String? errorCode;
  final int? bookingId;

  BookingDraftState copyWith({
    List<DateTime>? times,
    DateTime? selectedDate,
    DateTime? selectedTime,
    bool clearTime = false,
    String? errorCode,
    int? bookingId,
    bool clearError = false,
  }) {
    return BookingDraftState(
      displayName: displayName,
      phone: phone,
      placeId: placeId,
      dates: dates,
      times: times ?? this.times,
      selectedDate: selectedDate ?? this.selectedDate,
      selectedTime: clearTime ? null : selectedTime ?? this.selectedTime,
      slotMinutes: slotMinutes,
      noticeMinutes: noticeMinutes,
      closed: closed,
      maxParty: maxParty,
      errorCode: clearError ? null : errorCode ?? this.errorCode,
      bookingId: bookingId ?? this.bookingId,
    );
  }
}
