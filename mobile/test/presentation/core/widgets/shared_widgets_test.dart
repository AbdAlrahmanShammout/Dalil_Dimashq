import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';

void main() {
  testWidgets('home renders the shared scaffold, section, and button', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const DalilApp(locale: Locale('en')));
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
