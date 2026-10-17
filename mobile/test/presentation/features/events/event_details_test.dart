import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/events/pages/event_details_page.dart';

void main() {
  testWidgets('event details show description, address, phone, and place', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        home: EventDetailsPage(
          event: Event(
            id: 4,
            titleAr: 'ليالي دمشق',
            titleEn: 'Damascus nights',
            venueName: 'Al Azm',
            venueAddress: 'Old city',
            contactPhone: '+963111111111',
            descriptionEn: 'Music in the courtyard',
            placeId: 'azm',
            startsAt: DateTime.utc(2026, 11, 2, 18),
          ),
          placeBuilder: (String placeId) => Text('place-$placeId'),
        ),
      ),
    );
    expect(find.text('Music in the courtyard'), findsOneWidget);
    expect(find.text('Address: Old city'), findsOneWidget);
    expect(find.text('+963111111111'), findsOneWidget);
    await tester.tap(find.byKey(const Key('event-place')));
    await tester.pumpAndSettle();
    expect(find.text('place-azm'), findsOneWidget);
  });
}
