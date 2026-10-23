import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_place_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListOwnedPlacesUseCase {
  ListOwnedPlacesUseCase(this._repository);

  final OwnerPlaceRepository _repository;

  Future<Either<Failure, List<OwnedPlace>>> call() => _repository.list();
}
