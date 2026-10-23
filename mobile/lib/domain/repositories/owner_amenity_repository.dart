import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_amenities.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class OwnerAmenityRepository {
  Future<Either<Failure, OwnerAmenities>> load(String placeId);

  Future<Either<Failure, void>> add({
    required String placeId,
    required String code,
  });

  Future<Either<Failure, void>> remove({
    required String placeId,
    required String code,
  });
}
