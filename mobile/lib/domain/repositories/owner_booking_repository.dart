import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class OwnerBookingRepository {
  Future<Either<Failure, List<OwnerBooking>>> list(String placeId);

  Future<Either<Failure, String>> confirm(int id);

  Future<Either<Failure, String>> reject({required int id, String? reason});
}
