import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlacePhotoRepository {
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  });

  Future<Either<Failure, void>> setCover({
    required String placeId,
    required int photoId,
  });

  Future<Either<Failure, void>> setLogo({
    required String placeId,
    required int photoId,
  });

  Future<Either<Failure, void>> delete(int photoId);
}
