import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_immediate_fields.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlaceEditRepository {
  Future<Either<Failure, void>> saveImmediate({
    required String placeId,
    required PlaceImmediateFields fields,
  });
}
