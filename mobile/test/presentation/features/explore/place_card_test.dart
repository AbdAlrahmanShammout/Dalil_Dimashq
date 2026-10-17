import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_hour.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('a result card shows name, area, featured, stars, and open', (
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
              nameEn: 'Nawa',
              areaNameEn: 'Shaalan',
              stars: 4,
              isFeatured: true,
              hours: <PlaceHour>[
                PlaceHour(weekday: 0, opens: '00:00:00', closes: '23:59:00'),
                PlaceHour(weekday: 1, opens: '00:00:00', closes: '23:59:00'),
                PlaceHour(weekday: 2, opens: '00:00:00', closes: '23:59:00'),
                PlaceHour(weekday: 3, opens: '00:00:00', closes: '23:59:00'),
                PlaceHour(weekday: 4, opens: '00:00:00', closes: '23:59:00'),
                PlaceHour(weekday: 5, opens: '00:00:00', closes: '23:59:00'),
                PlaceHour(weekday: 6, opens: '00:00:00', closes: '23:59:00'),
              ],
            ),
          ],
          total: 1,
          counts: PlaceCategoryCounts(all: 1, hotels: 0, restaurants: 0, cafes: 1),
        ),
      );
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: exploreBlocForTest(repository),
      ),
    );
    await tester.pump();
    expect(find.text('Nawa'), findsOneWidget);
    expect(find.textContaining('Shaalan'), findsOneWidget);
    expect(find.textContaining('Featured'), findsWidgets);
    expect(find.textContaining('4'), findsOneWidget);
    expect(find.textContaining('Open now'), findsOneWidget);
  });
}
