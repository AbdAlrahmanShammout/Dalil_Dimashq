import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ReplyFakeReportUseCase {
  ReplyFakeReportUseCase(this._repository);

  final BookingRepository _repository;

  Future<Either<Failure, int?>> reportId(int bookingId) {
    return _repository.reportId(bookingId);
  }

  Future<Either<Failure, void>> reply({
    required int reportId,
    required String reply,
  }) {
    return _repository.replyToReport(reportId: reportId, reply: reply);
  }
}
