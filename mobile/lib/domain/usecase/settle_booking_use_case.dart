import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';
import 'package:dalil_dimashq/domain/services/attendance_window.dart';
import 'package:injectable/injectable.dart';

@injectable
class SettleBookingUseCase {
  SettleBookingUseCase(this._repository);

  final OwnerBookingRepository _repository;

  Future<Either<Failure, String>> cancel({
    required int id,
    required String reason,
    required DateTime bookingAt,
    required DateTime now,
  }) {
    final String value = reason.trim();
    if (value.isEmpty) {
      return Future<Either<Failure, String>>.value(
        const Left<Failure, String>(ValidationFailure('reason')),
      );
    }
    if (!canOwnerCancel(bookingAt: bookingAt, now: now)) {
      return Future<Either<Failure, String>>.value(
        const Left<Failure, String>(ValidationFailure('too_late')),
      );
    }
    return _repository.cancel(id: id, reason: value);
  }

  Future<Either<Failure, String>> mark({
    required int id,
    required bool attended,
    required DateTime bookingAt,
    required DateTime now,
  }) {
    if (!canMarkAttendance(bookingAt: bookingAt, now: now)) {
      return Future<Either<Failure, String>>.value(
        const Left<Failure, String>(ValidationFailure('attendance_window')),
      );
    }
    return _repository.mark(id: id, attended: attended);
  }
}
