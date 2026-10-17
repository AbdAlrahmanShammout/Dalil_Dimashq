import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';

void main() {
  testWidgets('home renders the shared scaffold, section, and button', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const DalilApp(locale: Locale('en')));
    expect(find.text('Dalil Dimashq'), findsOneWidget);
    expect(find.text('Directory'), findsOneWidget);
    expect(find.widgetWithText(FilledButton, 'English'), findsNothing);
    expect(find.widgetWithText(FilledButton, 'Arabic'), findsOneWidget);
  });
}
