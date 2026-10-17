import 'package:dalil_dimashq/core/storage/token_storage.dart';
import 'package:dalil_dimashq/domain/repositories/session_repository.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: SessionRepository)
class SessionRepositoryImpl implements SessionRepository {
  SessionRepositoryImpl(this._tokenStorage);

  final TokenStorage _tokenStorage;

  @override
  bool hasSession() {
    final String? token = _tokenStorage.getToken();
    return token != null && token.isNotEmpty;
  }
}
