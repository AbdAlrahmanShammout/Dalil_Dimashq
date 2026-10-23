import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlaceExitRepository {
  Future<Either<Failure, int>> unlink({
    required String placeId,
    required String reason,
  });
}
