import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class BookingRepository {
  Future<Either<Failure, BookingAvailability>> availability(String placeId);
}
