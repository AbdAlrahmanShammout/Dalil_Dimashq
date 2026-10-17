import 'package:dalil_dimashq/domain/repositories/locale_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ReadLocaleUseCase {
  ReadLocaleUseCase(this._repository);

  final LocaleRepository _repository;

  String? call() => _repository.readLanguageCode();
}
