import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dalil_dimashq/domain/usecase/sign_up_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_bloc.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/sign_up_page.dart';

void main() {
  testWidgets('a valid sign up tells the user to confirm the email', (
    WidgetTester tester,
  ) async {
    final _RecordingAuth repository = _RecordingAuth();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: SignUpPage(bloc: SignUpBloc(SignUpUseCase(repository))),
      ),
    );
    await tester.enterText(
      find.byKey(const Key('sign-up-email')),
      'nour@example.com',
    );
    await tester.enterText(
      find.byKey(const Key('sign-up-password')),
      'abc1234567',
    );
    await tester.enterText(find.byKey(const Key('sign-up-name')), 'Nour');
    await tester.tap(find.text('Create account'));
    await tester.pump();
    expect(repository.calls, 1);
    expect(
      find.text('Check your email to confirm the account'),
      findsOneWidget,
    );
  });
}

class _RecordingAuth implements AuthRepository {
  int calls = 0;

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    calls += 1;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signIn(SignInRequest request) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> recoverPassword(String email) async {
    return const Right<Failure, void>(null);
  }
}
