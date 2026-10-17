import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class GetPlaceUseCase {
  GetPlaceUseCase(this._repository);

  final PlaceRepository _repository;

  Future<Either<Failure, PlaceDetail>> call(String id) {
    return _repository.getPlace(id);
  }
}
