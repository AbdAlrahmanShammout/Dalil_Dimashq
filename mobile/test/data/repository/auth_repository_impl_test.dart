import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart';
import 'package:dalil_dimashq/data/dto/session_dto.dart';
import 'package:dalil_dimashq/data/repository/auth_repository_impl.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';

void main() {
  test('sign in stores the access token', () async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final SharedPreferences preferences = await SharedPreferences.getInstance();
    final TokenStorage storage = TokenStorage(preferences);
    final AuthRepositoryImpl repository = AuthRepositoryImpl(
      _FakeAuth(),
      storage,
    );
    final result = await repository.signIn(
      const SignInRequest(email: 'nour@example.com', password: 'abc1234567'),
    );
    expect(result.isRight(), isTrue);
    expect(storage.getToken(), 'session-token');
  });
}

class _FakeAuth implements AuthApiClient {
  @override
  Future<SessionDto> signIn(String grantType, Map<String, dynamic> body) async {
    return const SessionDto(accessToken: 'session-token');
  }

  @override
  Future<void> signUp(Map<String, dynamic> body) async {}
}
