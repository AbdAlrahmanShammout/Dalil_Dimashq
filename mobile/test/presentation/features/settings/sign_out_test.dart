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
import 'package:dalil_dimashq/domain/usecase/sign_out_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/bloc/sign_out_bloc.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/sign_out_button.dart';
import 'package:dartz/dartz.dart';

void main() {
  testWidgets('sign out returns to the visitor shell', (
    WidgetTester tester,
  ) async {
    final _MemoryAuth repository = _MemoryAuth();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Builder(
          builder: (BuildContext context) {
            return TextButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) => Scaffold(
                      body: SignOutButton(
                        bloc: SignOutBloc(SignOutUseCase(repository)),
                      ),
                    ),
                  ),
                );
              },
              child: const Text('shell'),
            );
          },
        ),
      ),
    );
    await tester.tap(find.text('shell'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Sign out'));
    await tester.pumpAndSettle();
    expect(repository.didSignOut, isTrue);
    expect(find.text('shell'), findsOneWidget);
  });

  test('sign out clears the stored token', () async {
    SharedPreferences.setMockInitialValues(<String, Object>{
      'auth_token': 'session-token',
    });
    final SharedPreferences preferences = await SharedPreferences.getInstance();
    final TokenStorage storage = TokenStorage(preferences);
    final AuthRepositoryImpl repository = AuthRepositoryImpl(
      _LogoutClient(),
      storage,
    );
    final result = await repository.signOut();
    expect(result.isRight(), isTrue);
    expect(storage.getToken(), isNull);
  });
}

class _MemoryAuth implements AuthRepository {
  bool didSignOut = false;

  @override
  Future<Either<Failure, void>> deleteAccount() async {
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
  Future<Either<Failure, void>> signOut() async {
    didSignOut = true;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    return const Right<Failure, void>(null);
  }
}

class _LogoutClient implements AuthApiClient {
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
