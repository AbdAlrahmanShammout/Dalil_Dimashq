import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlacePhotoRepository {
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  });
}
