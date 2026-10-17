import 'package:dalil_dimashq/domain/repositories/locale_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SaveLocaleUseCase {
  SaveLocaleUseCase(this._repository);

  final LocaleRepository _repository;

  Future<void> call(String languageCode) {
    return _repository.saveLanguageCode(languageCode);
  }
}
