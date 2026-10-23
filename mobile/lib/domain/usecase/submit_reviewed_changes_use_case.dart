import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/reviewed_place_changes.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SubmitReviewedChangesUseCase {
  SubmitReviewedChangesUseCase(this._repository);

  final ChangeRequestRepository _repository;

  Future<Either<Failure, void>> call({
    required String placeId,
    required ReviewedPlaceChanges changes,
  }) {
    final String? type = changes.type;
    if (type != null && type.isNotEmpty && !placeTypes.contains(type)) {
      return Future<Either<Failure, void>>.value(
        const Left<Failure, void>(ValidationFailure('place_type')),
      );
    }
    return _repository.submit(
      placeId: placeId,
      kind: 'edit',
      changes: changes.toJson(),
    );
  }
}
