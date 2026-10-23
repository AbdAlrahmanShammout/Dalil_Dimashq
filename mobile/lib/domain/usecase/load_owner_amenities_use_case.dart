import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_amenities.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_amenity_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadOwnerAmenitiesUseCase {
  LoadOwnerAmenitiesUseCase(this._repository);

  final OwnerAmenityRepository _repository;

  Future<Either<Failure, OwnerAmenities>> call(String placeId) =>
      _repository.load(placeId);
}
