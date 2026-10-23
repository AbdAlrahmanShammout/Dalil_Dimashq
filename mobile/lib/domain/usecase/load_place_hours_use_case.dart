import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_hours_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadPlaceHoursUseCase {
  LoadPlaceHoursUseCase(this._repository);

  final PlaceHoursRepository _repository;

  Future<Either<Failure, PlaceWeek>> call(String placeId) =>
      _repository.load(placeId);
}
