import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('a place with no photo shows its category fallback', (
    WidgetTester tester,
  ) async {
    final FakePlaceRepository repository = FakePlaceRepository()
      ..result = const Right(
        PlaceSearchPage(
          places: <PlaceSummary>[
            PlaceSummary(id: '1', type: 'cafe', nameAr: 'نواة'),
            PlaceSummary(id: '2', type: 'hotel', nameAr: 'بيت'),
            PlaceSummary(id: '3', type: 'restaurant', nameAr: 'شام'),
          ],
          total: 3,
          counts: PlaceCategoryCounts(
            all: 3,
            hotels: 1,
            restaurants: 1,
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
    expect(
      find.byKey(const Key('fallback-cafe')),
      findsOneWidget,
    );
    expect(find.byKey(const Key('fallback-hotel')), findsOneWidget);
    expect(find.byKey(const Key('fallback-restaurant')), findsOneWidget);
  });
}
