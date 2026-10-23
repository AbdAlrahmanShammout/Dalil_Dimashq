import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class DeviceRepository {
  Future<Either<Failure, void>> register({
    required String token,
    required String platform,
  });
}
