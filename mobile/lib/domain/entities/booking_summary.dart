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

  BookingSummary copyWith({String? status}) {
    return BookingSummary(
      id: id,
      status: status ?? this.status,
      placeId: placeId,
      at: at,
      party: party,
      note: note,
      reason: reason,
      reported: reported,
      placeName: placeName,
    );
  }
}
