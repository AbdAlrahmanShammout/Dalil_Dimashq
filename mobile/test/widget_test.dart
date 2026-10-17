import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';

void main() {
  testWidgets('DalilApp shows the app title', (WidgetTester tester) async {
    await tester.pumpWidget(const DalilApp(locale: Locale('en')));
    expect(find.text('Dalil Dimashq'), findsOneWidget);
  });
}
