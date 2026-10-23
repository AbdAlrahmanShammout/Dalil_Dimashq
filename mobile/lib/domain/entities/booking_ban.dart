class BookingBan {
  const BookingBan({required this.level, this.endsAt});

  final int level;
  final DateTime? endsAt;

  bool get isPermanent => endsAt == null || level >= 3;

  bool get isFortyFiveDays => !isPermanent && level == 2;
}
