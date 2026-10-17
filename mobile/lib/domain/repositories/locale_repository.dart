abstract class LocaleRepository {
  String? readLanguageCode();

  Future<void> saveLanguageCode(String code);
}
