import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListPlaceBookingsUseCase {
  ListPlaceBookingsUseCase(this._repository);

  final OwnerBookingRepository _repository;

  Future<Either<Failure, List<OwnerBooking>>> call(String placeId) =>
      _repository.list(placeId);
}
