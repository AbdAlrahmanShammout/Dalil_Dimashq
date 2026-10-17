import 'package:dalil_dimashq/domain/entities/place_hour.dart';

const Duration damascusOffset = Duration(hours: 3);

DateTime damascusTime(DateTime instant) => instant.toUtc().add(damascusOffset);

bool? isOpenNow(List<PlaceHour> hours, DateTime damascusNow) {
  if (hours.isEmpty) {
    return null;
  }
  final int weekday = damascusNow.weekday % 7;
  final int nowMinutes = damascusNow.hour * 60 + damascusNow.minute;
  final Iterable<PlaceHour> today = hours.where(
    (PlaceHour hour) => hour.weekday == weekday,
  );
  if (today.isEmpty) {
    return false;
  }
  for (final PlaceHour hour in today) {
    final int opens = _minutes(hour.opens);
    final int closes = _minutes(hour.closes);
    final bool open = closes > opens
        ? nowMinutes >= opens && nowMinutes < closes
        : nowMinutes >= opens || nowMinutes < closes;
    if (open) {
      return true;
    }
  }
  return false;
}

int _minutes(String clock) {
  final List<String> parts = clock.split(':');
  final int hours = int.parse(parts[0]);
  final int minutes = int.parse(parts[1]);
  return hours * 60 + minutes;
}
