import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_gate_page.dart';

void main() {
  testWidgets('owner area stays behind the sign-in gate', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const DalilApp(
        locale: Locale('en'),
        home: OwnerGatePage(hasSession: false),
      ),
    );
    expect(find.text('Sign in required'), findsOneWidget);
    expect(find.text('My places'), findsNothing);
    await tester.pumpWidget(
      const DalilApp(
        locale: Locale('en'),
        home: OwnerGatePage(hasSession: true),
      ),
    );
    expect(find.text('My places'), findsOneWidget);
  });
}
