import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SearchPlacesUseCase {
  SearchPlacesUseCase(this._repository);

  final PlaceRepository _repository;

  Future<Either<Failure, PlaceSearchPage>> call(PlaceSearchQuery query) {
    return _repository.search(query);
  }
}
