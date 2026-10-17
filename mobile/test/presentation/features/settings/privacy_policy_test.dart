import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/pages/privacy_policy_page.dart';

void main() {
  testWidgets('the privacy policy opens inside the app', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('ar'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: const PrivacyPolicyPage(),
      ),
    );
    expect(find.textContaining('0110098519'), findsOneWidget);
    expect(find.textContaining('16'), findsWidgets);
    expect(find.textContaining('العربية'), findsWidgets);
    expect(find.textContaining('16 سنة'), findsOneWidget);
  });
}
