import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:dalil_dimashq/domain/repositories/place_exit_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class RequestPlaceExitUseCase {
  RequestPlaceExitUseCase(this._requests, this._exit);

  final ChangeRequestRepository _requests;
  final PlaceExitRepository _exit;

  Future<Either<Failure, void>> remove({
    required String placeId,
    required String reason,
  }) {
    final String value = reason.trim();
    if (value.isEmpty) {
      return Future<Either<Failure, void>>.value(
        const Left<Failure, void>(ValidationFailure('reason')),
      );
    }
    return _requests.submit(
      placeId: placeId,
      kind: 'remove',
      changes: const <String, dynamic>{},
      message: value,
    );
  }

  Future<Either<Failure, int>> unlink({
    required String placeId,
    required String reason,
  }) {
    final String value = reason.trim();
    if (value.isEmpty) {
      return Future<Either<Failure, int>>.value(
        const Left<Failure, int>(ValidationFailure('reason')),
      );
    }
    return _exit.unlink(placeId: placeId, reason: value);
  }
}
