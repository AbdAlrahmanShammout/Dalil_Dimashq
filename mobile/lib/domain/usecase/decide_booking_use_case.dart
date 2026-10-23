import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class DecideBookingUseCase {
  DecideBookingUseCase(this._repository);

  final OwnerBookingRepository _repository;

  Future<Either<Failure, String>> confirm(int id) => _repository.confirm(id);

  Future<Either<Failure, String>> reject({required int id, String? reason}) {
    final String? value = reason?.trim();
    return _repository.reject(
      id: id,
      reason: value == null || value.isEmpty ? null : value,
    );
  }
}
