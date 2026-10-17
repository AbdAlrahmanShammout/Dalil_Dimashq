import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:dalil_dimashq/domain/entities/place_open_now.dart';

void main() {
  test('a place is open during a same-day period in Damascus time', () {
    final bool? open = isOpenNow(
      const <PlaceHour>[
        PlaceHour(weekday: 1, opens: '09:00:00', closes: '17:00:00'),
      ],
      DateTime.utc(2026, 10, 19, 10, 30),
    );
    expect(open, isTrue);
  });

  test('missing hours do not claim open or closed', () {
    expect(isOpenNow(const <PlaceHour>[], DateTime.utc(2026, 10, 19)), isNull);
  });
}
