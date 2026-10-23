import 'package:dalil_dimashq/domain/entities/booking_summary.dart';

BookingSummary? mapBookingSummary(dynamic raw) {
  if (raw is! Map) {
    return null;
  }
  final Map<String, dynamic> json = Map<String, dynamic>.from(raw);
  final int? id = json['id'] is int
      ? json['id'] as int
      : int.tryParse('${json['id']}');
  if (id == null) {
    return null;
  }
  return BookingSummary(
    id: id,
    status: '${json['current_status'] ?? json['status'] ?? ''}',
    placeId: json['place_id'] as String?,
    at: DateTime.tryParse('${json['booking_at'] ?? ''}'),
    party: json['party_size'] is int ? json['party_size'] as int : null,
    note: json['note'] as String?,
    reason: json['reason'] as String?,
    reported: json['reported'] == true,
    placeName: json['place_name'] as String?,
  );
}

List<BookingSummary> mapBookingList(dynamic raw) {
  if (raw is! List<dynamic>) {
    return const <BookingSummary>[];
  }
  return raw
      .map(mapBookingSummary)
      .whereType<BookingSummary>()
      .toList(growable: false);
}
