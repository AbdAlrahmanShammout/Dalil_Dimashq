import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_name_search_repository.dart';
import 'package:dalil_dimashq/domain/services/place_name_filter.dart';
import 'package:injectable/injectable.dart';

@injectable
class SearchPlacesByNameUseCase {
  SearchPlacesByNameUseCase(this._repository);

  final PlaceNameSearchRepository _repository;

  Future<Either<Failure, List<OwnedPlace>>> call(String name) {
    final String term = name.trim();
    if (term.isEmpty) {
      return Future<Either<Failure, List<OwnedPlace>>>.value(
        const Right<Failure, List<OwnedPlace>>(<OwnedPlace>[]),
      );
    }
    return _repository.byName(placeNameFilter(term));
  }
}
