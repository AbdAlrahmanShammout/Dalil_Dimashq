import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlaceHoursRepository {
  Future<Either<Failure, PlaceWeek>> load(String placeId);

  Future<Either<Failure, String>> save({
    required String placeId,
    required PlaceWeek week,
  });
}
