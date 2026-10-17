import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class NotificationsToggle extends StatefulWidget {
  const NotificationsToggle({this.repository, super.key});

  final NotificationPreferenceRepository? repository;

  @override
  State<NotificationsToggle> createState() => _NotificationsToggleState();
}

class _NotificationsToggleState extends State<NotificationsToggle> {
  late final NotificationPreferenceRepository _repository =
      widget.repository ?? getIt<NotificationPreferenceRepository>();
  late bool _isEnabled = _repository.isEnabled();

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      key: const Key('notifications-toggle'),
      value: _isEnabled,
      title: Text(AppLocalizations.of(context).notifications),
      onChanged: (bool value) async {
        await _repository.setEnabled(value);
        setState(() => _isEnabled = value);
      },
    );
  }
}
