import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('home renders the shared scaffold, section, and button', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: exploreBlocForTest(FakePlaceRepository()),
      ),
    );
    expect(find.text('Dalil Dimashq'), findsOneWidget);
    expect(find.text('Explore'), findsWidgets);
    expect(find.text('Map'), findsOneWidget);
    expect(find.text('Events'), findsOneWidget);
    expect(find.text('Account'), findsOneWidget);
    await tester.tap(find.text('Events'));
    await tester.pumpAndSettle();
    expect(find.text('Events'), findsNWidgets(2));
  });
}
