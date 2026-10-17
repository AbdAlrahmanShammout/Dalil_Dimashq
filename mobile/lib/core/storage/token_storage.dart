import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

@lazySingleton
class TokenStorage {
  TokenStorage(this._preferences);
  final SharedPreferences _preferences;
  static const String _tokenKey = 'auth_token';

  Future<void> saveToken(String token) async {
    await _preferences.setString(_tokenKey, token);
  }

  String? getToken() => _preferences.getString(_tokenKey);

  Future<void> clearToken() async {
    await _preferences.remove(_tokenKey);
  }
}
