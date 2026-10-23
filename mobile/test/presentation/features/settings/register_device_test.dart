import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/device_repository.dart';
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:dalil_dimashq/domain/services/device_push_token.dart';
import 'package:dalil_dimashq/domain/services/notification_permission.dart';
import 'package:dalil_dimashq/domain/usecase/register_device_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/notifications_toggle.dart';

void main() {
  test('a token is registered only for android or ios', () async {
    final _Devices devices = _Devices();
    await RegisterDeviceUseCase(devices, _Token('fcm-1', 'ios'))();
    expect(devices.token, 'fcm-1');
    expect(devices.platform, 'ios');
    final _Devices empty = _Devices();
    await RegisterDeviceUseCase(empty, _Token(null, 'android'))();
    expect(empty.token, isNull);
  });

  testWidgets('a granted permission registers the device token', (
    WidgetTester tester,
  ) async {
    final _Devices devices = _Devices();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: NotificationsToggle(
            repository: _MemoryNotifications(),
            permission: _Granted(),
            registerDevice: RegisterDeviceUseCase(
              devices,
              _Token('fcm-1', 'android'),
            ),
          ),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('notifications-toggle')));
    await tester.pump();
    expect(devices.platform, 'android');
  });
}

class _Token implements DevicePushToken {
  _Token(this.value, this.platformName);

  final String? value;
  final String platformName;

  @override
  String get platform => platformName;

  @override
  Future<String?> read() async => value;
}

class _Devices implements DeviceRepository {
  String? token;
  String? platform;

  @override
  Future<Either<Failure, void>> register({
    required String token,
    required String platform,
  }) async {
    this.token = token;
    this.platform = platform;
    return const Right<Failure, void>(null);
  }
}

class _Granted implements NotificationPermission {
  @override
  Future<bool> request() async => true;
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
