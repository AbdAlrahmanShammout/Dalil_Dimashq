import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/notifications_toggle.dart';

void main() {
  testWidgets('the notifications toggle is stored and gates permission', (
    WidgetTester tester,
  ) async {
    final _MemoryNotifications repository = _MemoryNotifications();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(body: NotificationsToggle(repository: repository)),
      ),
    );
    expect(shouldRequestNotificationPermission(repository), isFalse);
    await tester.tap(find.byKey(const Key('notifications-toggle')));
    await tester.pump();
    expect(repository.isEnabled(), isTrue);
    expect(shouldRequestNotificationPermission(repository), isTrue);
  });
}

class _MemoryNotifications implements NotificationPreferenceRepository {
  bool enabled = false;

  @override
  bool isEnabled() => enabled;

  @override
  Future<void> setEnabled(bool isEnabled) async {
    enabled = isEnabled;
  }
}
