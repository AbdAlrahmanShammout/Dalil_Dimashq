import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_immediate_fields.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_edit_repository.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SaveImmediateFieldsUseCase {
  SaveImmediateFieldsUseCase(this._repository, this._premium);

  final PlaceEditRepository _repository;
  final PremiumRepository _premium;

  Future<Either<Failure, void>> call({
    required String placeId,
    required PlaceImmediateFields fields,
    DateTime? now,
  }) async {
    final Either<Failure, PremiumStatus> premium = await _premium.load(
      now ?? DateTime.now(),
    );
    if (premium.isLeft()) {
      return Left<Failure, void>(premium.fold(
        (Failure failure) => failure,
        (PremiumStatus status) => const ServerFailure('premium'),
      ));
    }
    final PremiumStatus status = premium.getOrElse(
      () => const PremiumStatus(isActive: false, pendingRequests: 0),
    );
    if (!status.isActive) {
      return const Left<Failure, void>(ValidationFailure('premium_required'));
    }
    return _repository.saveImmediate(placeId: placeId, fields: fields);
  }
}
