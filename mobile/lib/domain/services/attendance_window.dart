const Duration attendanceLead = Duration(minutes: 30);
const Duration attendanceFollow = Duration(days: 3);

bool canMarkAttendance({required DateTime bookingAt, required DateTime now}) {
  final DateTime opens = bookingAt.subtract(attendanceLead);
  final DateTime closes = bookingAt.add(attendanceFollow);
  return !now.isBefore(opens) && !now.isAfter(closes);
}

bool canOwnerCancel({required DateTime bookingAt, required DateTime now}) {
  return now.isBefore(bookingAt);
}
