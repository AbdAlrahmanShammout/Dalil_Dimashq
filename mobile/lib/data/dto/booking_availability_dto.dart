import 'package:dalil_dimashq/domain/entities/booking_availability.dart';

BookingAvailability mapBookingAvailability(dynamic raw) {
  final Map<String, dynamic> json = raw is Map
      ? Map<String, dynamic>.from(raw)
      : <String, dynamic>{};
  return BookingAvailability(
    isAvailable: json['available'] == true,
    maxParty: _int(json['max_party']),
    confirmMinutes: _int(json['confirm_minutes']),
    minimumNoticeMinutes: _int(json['minimum_booking_notice_minutes']),
    horizonDays: _int(json['horizon_days']),
    lastDate: DateTime.tryParse('${json['last_date'] ?? ''}'),
    slotMinutes: _int(json['slot_minutes']),
    timeZone: '${json['time_zone'] ?? 'Asia/Damascus'}',
    isRespondingNow: json['responding_now'] == true,
    nextResponseAt: DateTime.tryParse('${json['next_response_at'] ?? ''}'),
    responseHours: _periods(json['response_hours']),
    closed: _periods(json['closed']),
  );
}

int _int(dynamic value) {
  if (value is int) {
    return value;
  }
  return int.tryParse('$value') ?? 0;
}

List<BookingPeriod> _periods(dynamic value) {
  if (value is! List<dynamic>) {
    return const <BookingPeriod>[];
  }
  return value
      .whereType<Map<dynamic, dynamic>>()
      .map((Map<dynamic, dynamic> item) {
        final Map<String, dynamic> json = Map<String, dynamic>.from(item);
        return BookingPeriod(
          weekday: json['weekday'] is int ? json['weekday'] as int : null,
          opens: json['opens'] as String?,
          closes: json['closes'] as String?,
          startsAt: DateTime.tryParse(
            '${json['starts_at'] ?? json['start'] ?? ''}',
          ),
          endsAt: DateTime.tryParse('${json['ends_at'] ?? json['end'] ?? ''}'),
        );
      })
      .toList(growable: false);
}
