import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart';
import 'package:dalil_dimashq/data/dto/session_dto.dart';
import 'package:dalil_dimashq/data/repository/auth_repository_impl.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dalil_dimashq/domain/usecase/delete_account_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/bloc/delete_account_bloc.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/delete_account_button.dart';
import 'package:dartz/dartz.dart';

void main() {
  testWidgets('the signed-in user can delete the account', (
    WidgetTester tester,
  ) async {
    final _MemoryAuth repository = _MemoryAuth();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: DeleteAccountButton(
            bloc: DeleteAccountBloc(DeleteAccountUseCase(repository)),
          ),
        ),
      ),
    );
    await tester.tap(find.text('Delete account'));
    await tester.pump();
    expect(repository.deleted, isTrue);
    expect(find.text('Account deleted'), findsOneWidget);
  });

  test('delete account clears the stored token', () async {
    SharedPreferences.setMockInitialValues(<String, Object>{
      'auth_token': 'session-token',
    });
    final SharedPreferences preferences = await SharedPreferences.getInstance();
    final TokenStorage storage = TokenStorage(preferences);
    final AuthRepositoryImpl repository = AuthRepositoryImpl(
      _DeletingClient(),
      storage,
    );
    final result = await repository.deleteAccount();
    expect(result.isRight(), isTrue);
    expect(storage.getToken(), isNull);
  });
}

class _MemoryAuth implements AuthRepository {
  bool deleted = false;

  @override
  Future<Either<Failure, void>> deleteAccount() async {
    deleted = true;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signOut() async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> recoverPassword(String email) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signIn(SignInRequest request) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    return const Right<Failure, void>(null);
  }
}

class _DeletingClient implements AuthApiClient {
  @override
  Future<dynamic> deleteAccount() async {}

  @override
  Future<void> logout() async {}

  @override
  Future<void> recover(Map<String, dynamic> body) async {}

  @override
  Future<SessionDto> signIn(
    String grantType,
    Map<String, dynamic> body,
  ) async {
    return const SessionDto(accessToken: '');
  }

  @override
  Future<void> signUp(Map<String, dynamic> body) async {}
}
