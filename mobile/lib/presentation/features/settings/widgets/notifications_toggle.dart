import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:dalil_dimashq/domain/services/notification_permission.dart';
import 'package:dalil_dimashq/domain/usecase/register_device_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class NotificationsToggle extends StatefulWidget {
  const NotificationsToggle({
    this.repository,
    this.permission,
    this.registerDevice,
    super.key,
  });

  final NotificationPreferenceRepository? repository;
  final NotificationPermission? permission;
  final RegisterDeviceUseCase? registerDevice;

  @override
  State<NotificationsToggle> createState() => _NotificationsToggleState();
}

class _NotificationsToggleState extends State<NotificationsToggle> {
  late final NotificationPreferenceRepository _repository =
      widget.repository ?? getIt<NotificationPreferenceRepository>();
  late bool _isEnabled = _repository.isEnabled();

  NotificationPermission? _permission() {
    if (widget.permission != null) {
      return widget.permission;
    }
    if (!getIt.isRegistered<NotificationPermission>()) {
      return null;
    }
    return getIt<NotificationPermission>();
  }

  RegisterDeviceUseCase? _register() {
    if (widget.registerDevice != null) {
      return widget.registerDevice;
    }
    if (!getIt.isRegistered<RegisterDeviceUseCase>()) {
      return null;
    }
    return getIt<RegisterDeviceUseCase>();
  }

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      key: const Key('notifications-toggle'),
      value: _isEnabled,
      title: Text(AppLocalizations.of(context).notifications),
      onChanged: (bool value) async {
        await _repository.setEnabled(value);
        if (value) {
          final bool granted = await _permission()?.request() ?? false;
          if (granted) {
            await _register()?.call();
          }
        }
        setState(() => _isEnabled = value);
      },
    );
  }
}
