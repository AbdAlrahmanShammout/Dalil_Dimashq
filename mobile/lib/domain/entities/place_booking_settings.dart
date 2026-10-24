class BookingOptions {
  const BookingOptions({
    required this.accepting,
    required this.maxParty,
    required this.minimumNoticeMinutes,
  });

  final bool accepting;
  final int maxParty;
  final int minimumNoticeMinutes;
}

class ReplyHour {
  const ReplyHour({
    required this.weekday,
    required this.opens,
    required this.closes,
    this.id,
  });

  final int? id;
  final int weekday;
  final String opens;
  final String closes;
}

class BookingClosure {
  const BookingClosure({
    required this.startsAt,
    required this.endsAt,
    this.id,
    this.reason,
  });

  final int? id;
  final DateTime startsAt;
  final DateTime endsAt;
  final String? reason;
}

class PlaceBookingSettings {
  const PlaceBookingSettings({
    required this.options,
    this.replyHours = const <ReplyHour>[],
    this.closures = const <BookingClosure>[],
  });

  final BookingOptions options;
  final List<ReplyHour> replyHours;
  final List<BookingClosure> closures;
}
