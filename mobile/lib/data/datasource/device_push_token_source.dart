import 'package:flutter/foundation.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/services/device_push_token.dart';

@LazySingleton(as: DevicePushToken)
class DevicePushTokenSource implements DevicePushToken {
  const DevicePushTokenSource();

  @override
  String get platform {
    if (defaultTargetPlatform == TargetPlatform.iOS) {
      return 'ios';
    }
    return 'android';
  }

  @override
  Future<String?> read() async => null;
}
