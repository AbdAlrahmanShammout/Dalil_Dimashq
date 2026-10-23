import 'package:flutter/services.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/services/notification_permission.dart';

@LazySingleton(as: NotificationPermission)
class SystemNotificationPermission implements NotificationPermission {
  const SystemNotificationPermission();

  static const MethodChannel channel = MethodChannel('dalil/notifications');

  @override
  Future<bool> request() async {
    try {
      return await channel.invokeMethod<bool>('requestPermission') ?? false;
    } on MissingPluginException {
      return false;
    } on PlatformException {
      return false;
    }
  }
}
