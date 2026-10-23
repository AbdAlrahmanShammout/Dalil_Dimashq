import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class CancelBookingUseCase {
  CancelBookingUseCase(this._repository);

  final BookingRepository _repository;

  Future<Either<Failure, String>> call(int id) => _repository.cancel(id);
}
