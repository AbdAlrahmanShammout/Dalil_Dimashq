import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
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

  test('an unconfirmed email stays signed out', () async {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    final SharedPreferences preferences = await SharedPreferences.getInstance();
    final AuthRepositoryImpl repository = AuthRepositoryImpl(
      _UnconfirmedAuth(),
      TokenStorage(preferences),
    );
    final result = await repository.signIn(
      const SignInRequest(email: 'nour@example.com', password: 'abc1234567'),
    );
    expect(
      result.fold((Failure failure) => failure, (_) => null),
      isA<EmailNotConfirmedFailure>(),
    );
  });
}

class _FakeAuth implements AuthApiClient {
  @override
  Future<SessionDto> signIn(String grantType, Map<String, dynamic> body) async {
    return const SessionDto(accessToken: 'session-token');
  }

  @override
  Future<void> signUp(Map<String, dynamic> body) async {}

  @override
  Future<void> recover(Map<String, dynamic> body) async {}

  @override
  Future<dynamic> deleteAccount() async {}
}

class _UnconfirmedAuth implements AuthApiClient {
  @override
  Future<SessionDto> signIn(String grantType, Map<String, dynamic> body) async {
    final RequestOptions options = RequestOptions(path: '/auth/v1/token');
    throw DioException(
      requestOptions: options,
      response: Response<Map<String, dynamic>>(
        requestOptions: options,
        statusCode: 400,
        data: <String, dynamic>{'msg': 'Email not confirmed'},
      ),
    );
  }

  @override
  Future<void> signUp(Map<String, dynamic> body) async {}

  @override
  Future<void> recover(Map<String, dynamic> body) async {}

  @override
  Future<dynamic> deleteAccount() async {}
}
