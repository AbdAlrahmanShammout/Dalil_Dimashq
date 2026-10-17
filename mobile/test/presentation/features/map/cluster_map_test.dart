import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/map/widgets/cluster_map.dart';

void main() {
  testWidgets('nearby places cluster and a marker can be selected', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        locale: Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: ClusterMap(
            places: <PlaceSummary>[
              PlaceSummary(
                id: 'a',
                type: 'cafe',
                nameAr: 'نواة',
                latitude: 33.513,
                longitude: 36.276,
              ),
              PlaceSummary(
                id: 'b',
                type: 'cafe',
                nameAr: 'بيت',
                latitude: 33.514,
                longitude: 36.277,
              ),
            ],
          ),
        ),
      ),
    );
    expect(find.text('2'), findsOneWidget);
    expect(find.text('نواة'), findsNothing);
    await tester.tap(find.text('2'));
    await tester.pump();
    await tester.tap(find.byKey(const Key('marker-a')));
    await tester.pump();
    expect(find.text('a'), findsOneWidget);
  });
}
