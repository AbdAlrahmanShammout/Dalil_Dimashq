import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListAreasUseCase {
  ListAreasUseCase(this._repository);

  final PlaceRepository _repository;

  Future<Either<Failure, List<Area>>> call() {
    return _repository.areas();
  }
}
