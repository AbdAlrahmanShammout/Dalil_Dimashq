import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadBookingAvailabilityUseCase {
  LoadBookingAvailabilityUseCase(this._repository);

  final BookingRepository _repository;

  Future<Either<Failure, BookingAvailability>> call(String placeId) {
    return _repository.availability(placeId);
  }
}
