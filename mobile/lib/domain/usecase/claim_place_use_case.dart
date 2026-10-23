import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_claim_repository.dart';
import 'package:dalil_dimashq/domain/services/place_link_code.dart';
import 'package:injectable/injectable.dart';

@injectable
class ClaimPlaceUseCase {
  ClaimPlaceUseCase(this._repository);

  final PlaceClaimRepository _repository;

  Future<Either<Failure, bool>> call({
    required String placeId,
    required String code,
  }) {
    if (!isPlaceLinkCode(code)) {
      return Future<Either<Failure, bool>>.value(
        const Left<Failure, bool>(ValidationFailure('invalid_code')),
      );
    }
    return _repository.claimWithCode(placeId: placeId, code: code.trim());
  }
}
