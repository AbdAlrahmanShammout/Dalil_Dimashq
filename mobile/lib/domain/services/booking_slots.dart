import 'package:dalil_dimashq/domain/entities/booking_availability.dart';

const Duration damascusOffset = Duration(hours: 3);

List<DateTime> bookingDates({
  required DateTime now,
  required int horizonDays,
  DateTime? lastDate,
}) {
  final DateTime local = now.toUtc().add(damascusOffset);
  final DateTime start = DateTime.utc(local.year, local.month, local.day);
  final int days = horizonDays <= 0 ? 1 : horizonDays;
  final List<DateTime> dates = <DateTime>[];
  for (int index = 0; index < days; index++) {
    final DateTime date = start.add(Duration(days: index));
    if (lastDate != null && _dateOnly(date).isAfter(_dateOnly(lastDate))) {
      break;
    }
    dates.add(date);
  }
  return dates;
}

List<DateTime> bookingTimes({
  required DateTime date,
  required DateTime now,
  required int slotMinutes,
  required int noticeMinutes,
  required List<BookingPeriod> closed,
}) {
  final int step = slotMinutes <= 0 ? 15 : slotMinutes;
  final DateTime earliest = now.toUtc().add(Duration(minutes: noticeMinutes));
  final List<DateTime> slots = <DateTime>[];
  for (int minute = 0; minute < 24 * 60; minute += step) {
    final DateTime slot = DateTime.utc(
      date.year,
      date.month,
      date.day,
    ).add(Duration(minutes: minute)).subtract(damascusOffset);
    if (slot.isBefore(earliest) || _isClosed(slot, closed)) {
      continue;
    }
    slots.add(slot);
  }
  return slots;
}

String formatDamascusDate(DateTime date) {
  final String month = date.month.toString().padLeft(2, '0');
  final String day = date.day.toString().padLeft(2, '0');
  return '${date.year}-$month-$day';
}

String formatDamascusTime(DateTime slot) {
  final DateTime local = slot.toUtc().add(damascusOffset);
  final String hour = local.hour.toString().padLeft(2, '0');
  final String minute = local.minute.toString().padLeft(2, '0');
  return '$hour:$minute';
}

DateTime _dateOnly(DateTime value) {
  return DateTime.utc(value.year, value.month, value.day);
}

bool _isClosed(DateTime slot, List<BookingPeriod> closed) {
  return closed.any((BookingPeriod period) {
    final DateTime? start = period.startsAt;
    final DateTime? end = period.endsAt;
    if (start == null || end == null) {
      return false;
    }
    return !slot.isBefore(start) && slot.isBefore(end);
  });
}
