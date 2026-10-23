abstract class BookingDraftEvent {
  const BookingDraftEvent();
}

class BookingDraftStarted extends BookingDraftEvent {
  const BookingDraftStarted({this.placeId});

  final String? placeId;
}

class BookingDateSelected extends BookingDraftEvent {
  const BookingDateSelected(this.date);

  final DateTime date;
}

class BookingTimeSelected extends BookingDraftEvent {
  const BookingTimeSelected(this.time);

  final DateTime time;
}

class BookingSubmitted extends BookingDraftEvent {
  const BookingSubmitted({
    required this.name,
    required this.phone,
    required this.party,
    required this.note,
  });

  final String name;
  final String phone;
  final int party;
  final String note;
}
