import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/map/widgets/cluster_map.dart';

void main() {
  testWidgets('the marker card shows the place and opens it', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: ClusterMap(
            places: const <PlaceSummary>[
              PlaceSummary(
                id: 'a',
                type: 'cafe',
                nameAr: 'نواة',
                nameEn: 'Nawa',
                latitude: 33.5,
                longitude: 36.2,
              ),
            ],
            onOpenPlace: (PlaceSummary place) {
              Navigator.of(
                tester.element(find.byType(ClusterMap)),
              ).push(
                MaterialPageRoute<void>(
                  builder: (_) => Text('opened-${place.id}'),
                ),
              );
            },
          ),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('marker-a')));
    await tester.pump();
    expect(find.text('Nawa'), findsOneWidget);
    await tester.tap(find.byKey(const Key('marker-preview')));
    await tester.pumpAndSettle();
    expect(find.text('opened-a'), findsOneWidget);
  });
}
