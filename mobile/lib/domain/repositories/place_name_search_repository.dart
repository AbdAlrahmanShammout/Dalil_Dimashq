import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlaceNameSearchRepository {
  Future<Either<Failure, List<OwnedPlace>>> byName(String filter);
}
