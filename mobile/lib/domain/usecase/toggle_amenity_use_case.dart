import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_amenity_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ToggleAmenityUseCase {
  ToggleAmenityUseCase(this._repository);

  final OwnerAmenityRepository _repository;

  Future<Either<Failure, void>> call({
    required String placeId,
    required String code,
    required bool isSelected,
  }) {
    if (isSelected) {
      return _repository.remove(placeId: placeId, code: code);
    }
    return _repository.add(placeId: placeId, code: code);
  }
}
