import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_ban.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadBookingBanUseCase {
  LoadBookingBanUseCase(this._repository);

  final BookingRepository _repository;

  Future<Either<Failure, BookingBan?>> call(DateTime now) {
    return _repository.activeBan(now);
  }
}
