import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_hours_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SavePlaceHoursUseCase {
  SavePlaceHoursUseCase(this._repository);

  final PlaceHoursRepository _repository;

  Future<Either<Failure, String>> call({
    required String placeId,
    required PlaceWeek week,
  }) {
    return _repository.save(placeId: placeId, week: week);
  }
}
