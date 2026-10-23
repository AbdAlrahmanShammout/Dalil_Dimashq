import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SubmitClaimUseCase {
  SubmitClaimUseCase(this._repository);

  final ChangeRequestRepository _repository;

  Future<Either<Failure, void>> call(String placeId) {
    return _repository.submit(
      placeId: placeId,
      kind: 'claim',
      changes: const <String, dynamic>{},
    );
  }
}
