class BookingPeriod {
  const BookingPeriod({
    this.weekday,
    this.opens,
    this.closes,
    this.startsAt,
    this.endsAt,
  });

  final int? weekday;
  final String? opens;
  final String? closes;
  final DateTime? startsAt;
  final DateTime? endsAt;
}

class BookingAvailability {
  const BookingAvailability({
    required this.isAvailable,
    required this.maxParty,
    required this.confirmMinutes,
    required this.minimumNoticeMinutes,
    required this.horizonDays,
    required this.lastDate,
    required this.slotMinutes,
    required this.timeZone,
    required this.isRespondingNow,
    required this.nextResponseAt,
    required this.responseHours,
    required this.closed,
  });

  final bool isAvailable;
  final int maxParty;
  final int confirmMinutes;
  final int minimumNoticeMinutes;
  final int horizonDays;
  final DateTime? lastDate;
  final int slotMinutes;
  final String timeZone;
  final bool isRespondingNow;
  final DateTime? nextResponseAt;
  final List<BookingPeriod> responseHours;
  final List<BookingPeriod> closed;
}
