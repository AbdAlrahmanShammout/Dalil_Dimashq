import 'package:dalil_dimashq/domain/repositories/locale_repository.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

@LazySingleton(as: LocaleRepository)
class LocaleRepositoryImpl implements LocaleRepository {
  LocaleRepositoryImpl(this._preferences);

  final SharedPreferences _preferences;
  static const String _languageKey = 'language_code';

  @override
  String? readLanguageCode() => _preferences.getString(_languageKey);

  @override
  Future<void> saveLanguageCode(String code) {
    return _preferences.setString(_languageKey, code);
  }
}
