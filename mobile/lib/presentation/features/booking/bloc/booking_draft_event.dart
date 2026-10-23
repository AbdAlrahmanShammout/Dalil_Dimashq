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
