import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlaceClaimRepository {
  Future<Either<Failure, bool>> claimWithCode({
    required String placeId,
    required String code,
  });
}
