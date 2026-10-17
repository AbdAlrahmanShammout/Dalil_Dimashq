import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dalil_dimashq/domain/usecase/sign_in_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_bloc.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/sign_in_page.dart';

void main() {
  testWidgets('sign in confirms the session', (WidgetTester tester) async {
    final _RecordingAuth repository = _RecordingAuth();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: SignInPage(bloc: SignInBloc(SignInUseCase(repository))),
      ),
    );
    await tester.enterText(
      find.byKey(const Key('sign-in-email')),
      'nour@example.com',
    );
    await tester.enterText(
      find.byKey(const Key('sign-in-password')),
      'abc1234567',
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pump();
    expect(repository.signedIn?.email, 'nour@example.com');
    expect(find.text('Signed in'), findsOneWidget);
  });

  testWidgets('an unconfirmed account is told to confirm first', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: SignInPage(bloc: SignInBloc(SignInUseCase(_UnconfirmedAuth()))),
      ),
    );
    await tester.enterText(
      find.byKey(const Key('sign-in-email')),
      'nour@example.com',
    );
    await tester.enterText(
      find.byKey(const Key('sign-in-password')),
      'abc1234567',
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pump();
    expect(find.text('Confirm your email before continuing'), findsOneWidget);
  });
}

class _RecordingAuth implements AuthRepository {
  SignInRequest? signedIn;

  @override
  Future<Either<Failure, void>> signIn(SignInRequest request) async {
    signedIn = request;
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> recoverPassword(String email) async {
    return const Right<Failure, void>(null);
  }
}

class _UnconfirmedAuth implements AuthRepository {
  @override
  Future<Either<Failure, void>> signIn(SignInRequest request) async {
    return const Left<Failure, void>(
      EmailNotConfirmedFailure('Email not confirmed'),
    );
  }

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> recoverPassword(String email) async {
    return const Right<Failure, void>(null);
  }
}
