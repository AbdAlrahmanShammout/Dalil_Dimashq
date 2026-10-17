import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_areas_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';

void main() {
  testWidgets('filters apply to search and clear removes them', (
    WidgetTester tester,
  ) async {
    final _FilterRepository repository = _FilterRepository();
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: ExploreBloc(
          SearchPlacesUseCase(repository),
          ListAreasUseCase(repository),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('filters-open')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('filter-category-hotels')));
    await tester.tap(find.byKey(const Key('filter-stars-4')));
    await tester.enterText(find.byKey(const Key('filter-area-search')), 'sha');
    await tester.pump();
    await tester.tap(find.byKey(const Key('filter-area-1')));
    await tester.tap(find.byKey(const Key('filter-has-phone')));
    await tester.tap(find.byKey(const Key('filter-sort-rating')));
    await tester.tap(find.byKey(const Key('filter-apply')));
    await tester.pumpAndSettle();
    expect(repository.lastQuery?.category, PlaceCategory.hotels);
    expect(repository.lastQuery?.minStars, 4);
    expect(repository.lastQuery?.areaId, 1);
    expect(repository.lastQuery?.hasPhone, isTrue);
    expect(repository.lastQuery?.sort, PlaceSort.rating);
    expect(find.text('نواة'), findsOneWidget);
    expect(find.text('Filters (5)'), findsOneWidget);
    await tester.tap(find.byKey(const Key('filters-open')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const Key('filter-clear')));
    await tester.pumpAndSettle();
    expect(repository.lastQuery?.category, PlaceCategory.all);
    expect(repository.lastQuery?.minStars, isNull);
    expect(repository.lastQuery?.areaId, isNull);
    expect(repository.lastQuery?.hasPhone, isFalse);
    expect(repository.lastQuery?.sort, PlaceSort.completeness);
    expect(find.text('Filters (0)'), findsOneWidget);
  });
}

class _FilterRepository implements PlaceRepository {
  PlaceSearchQuery? lastQuery;

  @override
  Future<Either<Failure, PlaceSearchPage>> search(
    PlaceSearchQuery query,
  ) async {
    lastQuery = query;
    final bool matched =
        query.category == PlaceCategory.hotels &&
        query.minStars == 4 &&
        query.areaId == 1 &&
        query.hasPhone &&
        query.sort == PlaceSort.rating;
    return Right(
      PlaceSearchPage(
        places: matched
            ? const <PlaceSummary>[
                PlaceSummary(id: '1', type: 'hotel', nameAr: 'نواة'),
              ]
            : const <PlaceSummary>[],
        total: matched ? 1 : 0,
        counts: PlaceCategoryCounts(
          all: matched ? 1 : 0,
          hotels: matched ? 1 : 0,
          restaurants: 0,
          cafes: 0,
        ),
      ),
    );
  }

  @override
  Future<Either<Failure, List<Area>>> areas() async {
    return const Right(<Area>[
      Area(id: 1, nameAr: 'الشعلان', nameEn: 'Shaalan'),
    ]);
  }
}
