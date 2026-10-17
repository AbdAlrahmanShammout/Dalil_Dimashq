import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';

void main() {
  testWidgets('a failed search can be retried', (WidgetTester tester) async {
    final _FlakyRepository repository = _FlakyRepository();
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: ExploreBloc(SearchPlacesUseCase(repository)),
      ),
    );
    await tester.pump();
    expect(find.text('down'), findsOneWidget);
    await tester.tap(find.text('Retry'));
    await tester.pump();
    expect(find.text('نواة'), findsOneWidget);
    expect(repository.calls, 2);
  });
}

class _FlakyRepository implements PlaceRepository {
  int calls = 0;

  @override
  Future<Either<Failure, PlaceSearchPage>> search(PlaceSearchQuery query) async {
    calls += 1;
    if (calls == 1) {
      return const Left(ServerFailure('down'));
    }
    return const Right(
      PlaceSearchPage(
        places: <PlaceSummary>[
          PlaceSummary(id: '1', type: 'cafe', nameAr: 'نواة'),
        ],
        total: 1,
        counts: PlaceCategoryCounts(all: 1, hotels: 0, restaurants: 0, cafes: 1),
      ),
    );
  }
}
