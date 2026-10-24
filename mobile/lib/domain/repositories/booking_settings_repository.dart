import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_booking_settings.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class BookingSettingsRepository {
  Future<Either<Failure, PlaceBookingSettings>> load(String placeId);

  Future<Either<Failure, void>> saveOptions({
    required String placeId,
    required bool accepting,
    required int maxParty,
    required int minimumNoticeMinutes,
  });

  Future<Either<Failure, void>> addReplyHour({
    required String placeId,
    required int weekday,
    required String opens,
    required String closes,
  });

  Future<Either<Failure, void>> removeReplyHour(int id);

  Future<Either<Failure, void>> addClosure({
    required String placeId,
    required DateTime startsAt,
    required DateTime endsAt,
    String? reason,
  });

  Future<Either<Failure, void>> removeClosure(int id);
}
