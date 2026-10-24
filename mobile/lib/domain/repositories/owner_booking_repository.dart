import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class OwnerBookingRepository {
  Future<Either<Failure, List<OwnerBooking>>> list(String placeId);

  Future<Either<Failure, String>> confirm(int id);

  Future<Either<Failure, String>> reject({required int id, String? reason});

  Future<Either<Failure, String>> cancel({
    required int id,
    required String reason,
  });

  Future<Either<Failure, String>> mark({
    required int id,
    required bool attended,
  });

  Future<Either<Failure, int>> reportFake({
    required int id,
    required String reason,
  });
}
