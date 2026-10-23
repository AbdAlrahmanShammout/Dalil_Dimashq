import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadBookingUseCase {
  LoadBookingUseCase(this._repository);

  final BookingRepository _repository;

  Future<Either<Failure, BookingSummary>> call(int id) => _repository.find(id);
}
