class BookingSummary {
  const BookingSummary({
    required this.id,
    required this.status,
    this.placeId,
    this.at,
    this.party,
    this.note,
    this.reason,
    this.reported = false,
    this.placeName,
  });

  final int id;
  final String status;
  final String? placeId;
  final DateTime? at;
  final int? party;
  final String? note;
  final String? reason;
  final bool reported;
  final String? placeName;
}
