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

  BookingDraftState copyWith({
    List<DateTime>? times,
    DateTime? selectedDate,
    DateTime? selectedTime,
    bool clearTime = false,
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
    );
  }
}
