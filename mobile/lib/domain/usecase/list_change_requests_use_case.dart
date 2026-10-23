import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListChangeRequestsUseCase {
  ListChangeRequestsUseCase(this._repository);

  final ChangeRequestRepository _repository;

  Future<Either<Failure, List<PlaceChangeRequest>>> call(String placeId) {
    return _repository.list(placeId);
  }
}
