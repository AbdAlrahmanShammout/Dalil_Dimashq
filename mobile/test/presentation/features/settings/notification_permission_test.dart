import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:dalil_dimashq/domain/services/notification_permission.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/notifications_toggle.dart';

void main() {
  testWidgets('enabling notifications requests system permission', (
    WidgetTester tester,
  ) async {
    final _Permission permission = _Permission();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: NotificationsToggle(
            repository: _MemoryNotifications(),
            permission: permission,
          ),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('notifications-toggle')));
    await tester.pump();
    expect(permission.requests, 1);
    await tester.tap(find.byKey(const Key('notifications-toggle')));
    await tester.pump();
    expect(permission.requests, 1);
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

class _Permission implements NotificationPermission {
  int requests = 0;

  @override
  Future<bool> request() async {
    requests += 1;
    return true;
  }
}
