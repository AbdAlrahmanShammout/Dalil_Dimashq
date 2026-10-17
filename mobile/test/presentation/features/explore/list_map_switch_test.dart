import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('the same results switch between list and map', (
    WidgetTester tester,
  ) async {
    final FakePlaceRepository repository = FakePlaceRepository()
      ..result = const Right(
        PlaceSearchPage(
          places: <PlaceSummary>[
            PlaceSummary(
              id: '1',
              type: 'cafe',
              nameAr: 'نواة',
              latitude: 33.5,
              longitude: 36.2,
            ),
          ],
          total: 1,
          counts: PlaceCategoryCounts(
            all: 1,
            hotels: 0,
            restaurants: 0,
            cafes: 1,
          ),
        ),
      );
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: exploreBlocForTest(repository),
      ),
    );
    await tester.pump();
    expect(find.text('نواة'), findsWidgets);
    expect(find.byKey(const Key('marker-1')), findsNothing);
    await tester.tap(find.byKey(const Key('list-map-switch')));
    await tester.pump();
    expect(find.byKey(const Key('marker-1')), findsOneWidget);
    expect(repository.lastQuery?.sort.name, 'completeness');
  });
}
