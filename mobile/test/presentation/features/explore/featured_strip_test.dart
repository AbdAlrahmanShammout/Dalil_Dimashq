import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('featured places show a featured badge', (WidgetTester tester) async {
    final FakePlaceRepository repository = FakePlaceRepository()
      ..result = const Right(
        PlaceSearchPage(
          places: <PlaceSummary>[
            PlaceSummary(
              id: '1',
              type: 'hotel',
              nameAr: 'بيت الورد',
              isFeatured: true,
            ),
          ],
          total: 1,
          counts: PlaceCategoryCounts(all: 1, hotels: 1, restaurants: 0, cafes: 0),
        ),
      );
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: exploreBlocForTest(repository),
      ),
    );
    await tester.pump();
    expect(find.text('بيت الورد · Featured'), findsOneWidget);
  });
}
