import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('category chips filter search and show counts', (
    WidgetTester tester,
  ) async {
    final FakePlaceRepository repository = FakePlaceRepository()
      ..result = const Right(
        PlaceSearchPage(
          places: [],
          total: 10,
          counts: PlaceCategoryCounts(
            all: 10,
            hotels: 4,
            restaurants: 5,
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
    expect(find.text('Hotels 4'), findsOneWidget);
    await tester.tap(find.text('Hotels 4'));
    await tester.pump();
    expect(repository.lastQuery?.category, PlaceCategory.hotels);
  });
}
