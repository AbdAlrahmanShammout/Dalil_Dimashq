import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/services/device_location.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/map/widgets/cluster_map.dart';

void main() {
  testWidgets('near me asks permission and centers without sorting', (
    WidgetTester tester,
  ) async {
    final _FakeLocation location = _FakeLocation();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: ClusterMap(
            location: location,
            places: const <PlaceSummary>[
              PlaceSummary(
                id: 'far',
                type: 'cafe',
                nameAr: 'بعيد',
                latitude: 33.1,
                longitude: 36.1,
              ),
              PlaceSummary(
                id: 'near',
                type: 'cafe',
                nameAr: 'قريب',
                latitude: 33.9,
                longitude: 36.9,
              ),
            ],
          ),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('near-me')));
    await tester.pump();
    expect(location.permissionRequests, 1);
    expect(find.text('33.51,36.29'), findsOneWidget);
    expect(
      find.byKey(const Key('marker-far')),
      findsOneWidget,
    );
    expect(find.byKey(const Key('marker-near')), findsOneWidget);
  });
}

class _FakeLocation implements DeviceLocation {
  int permissionRequests = 0;

  @override
  Future<bool> requestPermission() async {
    permissionRequests += 1;
    return true;
  }

  @override
  Future<GeoPoint?> currentPosition() async {
    return const GeoPoint(latitude: 33.51, longitude: 36.29);
  }
}
