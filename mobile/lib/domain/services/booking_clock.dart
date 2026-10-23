import 'package:injectable/injectable.dart';

@lazySingleton
class BookingClock {
  DateTime now() => DateTime.now();
}
