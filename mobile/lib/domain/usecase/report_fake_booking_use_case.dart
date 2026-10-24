import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:dalil_dimashq/domain/services/fake_booking_rules.dart';
import 'package:injectable/injectable.dart';

@injectable
class ReportFakeBookingUseCase {
  ReportFakeBookingUseCase(this._repository);

  final OwnerBookingRepository _repository;

  Future<Either<Failure, int>> call({
    required int id,
    required String reason,
    required bool reported,
    required String status,
  }) {
    final String value = reason.trim();
    if (value.isEmpty) {
      return Future<Either<Failure, int>>.value(
        const Left<Failure, int>(ValidationFailure('reason')),
      );
    }
    if (!canReportFakeBooking(reported: reported, status: status)) {
      return Future<Either<Failure, int>>.value(
        const Left<Failure, int>(ValidationFailure('already_reported')),
      );
    }
    return _repository.reportFake(id: id, reason: value);
  }
}
