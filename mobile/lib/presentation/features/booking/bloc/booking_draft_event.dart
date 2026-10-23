abstract class BookingDraftEvent {
  const BookingDraftEvent();
}

class BookingDraftStarted extends BookingDraftEvent {
  const BookingDraftStarted({this.placeId});

  final String? placeId;
}
