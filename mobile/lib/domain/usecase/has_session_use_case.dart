import 'package:dalil_dimashq/domain/repositories/session_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class HasSessionUseCase {
  HasSessionUseCase(this._repository);

  final SessionRepository _repository;

  bool call() => _repository.hasSession();
}
