class BookingRequest {
  const BookingRequest({
    required this.placeId,
    required this.at,
    required this.party,
    required this.name,
    required this.phone,
    required this.clientKey,
    this.note,
  });

  final String placeId;
  final DateTime at;
  final int party;
  final String name;
  final String phone;
  final String clientKey;
  final String? note;

  static const int maxNoteLength = 300;
}
