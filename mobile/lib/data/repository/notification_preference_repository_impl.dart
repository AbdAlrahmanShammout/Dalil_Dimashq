import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

@LazySingleton(as: NotificationPreferenceRepository)
class NotificationPreferenceRepositoryImpl
    implements NotificationPreferenceRepository {
  NotificationPreferenceRepositoryImpl(this._preferences);

  final SharedPreferences _preferences;
  static const String _enabledKey = 'notifications_enabled';

  @override
  bool isEnabled() => _preferences.getBool(_enabledKey) ?? false;

  @override
  Future<void> setEnabled(bool isEnabled) {
    return _preferences.setBool(_enabledKey, isEnabled);
  }
}
