import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';

class FakePlaceRepository implements PlaceRepository {
  PlaceSearchQuery? lastQuery;
  Either<Failure, PlaceSearchPage> result = const Right(
    PlaceSearchPage(
      places: <PlaceSummary>[],
      total: 0,
      counts: PlaceCategoryCounts(all: 0, hotels: 0, restaurants: 0, cafes: 0),
    ),
  );

  @override
  Future<Either<Failure, PlaceSearchPage>> search(
    PlaceSearchQuery query,
  ) async {
    lastQuery = query;
    return result;
  }
}

ExploreBloc exploreBlocForTest(FakePlaceRepository repository) {
  return ExploreBloc(SearchPlacesUseCase(repository));
}
