abstract class DevicePushToken {
  Future<String?> read();

  String get platform;
}
