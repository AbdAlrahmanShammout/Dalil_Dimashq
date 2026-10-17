import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_event.dart';

void main() {
  test('scrolling requests the next page and appends it', () async {
    final _PagingRepository repository = _PagingRepository();
    final ExploreBloc bloc = ExploreBloc(SearchPlacesUseCase(repository));
    bloc.add(const ExploreStarted());
    await bloc.stream.firstWhere((state) => state.places.length == 1);
    bloc.add(const ExploreLoadMore());
    await bloc.stream.firstWhere((state) => state.places.length == 2);
    expect(repository.offsets, <int>[0, 1]);
    expect(bloc.state.places.map((PlaceSummary place) => place.id), <String>[
      'a',
      'b',
    ]);
    await bloc.close();
  });
}

class _PagingRepository implements PlaceRepository {
  final List<int> offsets = <int>[];

  @override
  Future<Either<Failure, PlaceSearchPage>> search(
    PlaceSearchQuery query,
  ) async {
    offsets.add(query.offset);
    final PlaceSummary place = PlaceSummary(
      id: query.offset == 0 ? 'a' : 'b',
      type: 'cafe',
      nameAr: query.offset == 0 ? 'أول' : 'ثاني',
    );
    return Right(
      PlaceSearchPage(
        places: <PlaceSummary>[place],
        total: 2,
        counts: const PlaceCategoryCounts(
          all: 2,
          hotels: 0,
          restaurants: 0,
          cafes: 2,
        ),
      ),
    );
  }
}
