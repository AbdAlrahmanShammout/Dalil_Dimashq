import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dalil_dimashq/domain/usecase/recover_password_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_bloc.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/recovery_page.dart';

void main() {
  testWidgets('a recovery email can be requested', (WidgetTester tester) async {
    final _RecordingAuth repository = _RecordingAuth();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: RecoveryPage(
          bloc: RecoveryBloc(RecoverPasswordUseCase(repository)),
        ),
      ),
    );
    await tester.enterText(
      find.byKey(const Key('recovery-email')),
      'nour@example.com',
    );
    await tester.tap(find.text('Send recovery email'));
    await tester.pump();
    expect(repository.email, 'nour@example.com');
    expect(find.text('Check your email for password recovery'), findsOneWidget);
  });
}

class _RecordingAuth implements AuthRepository {
  String? email;

  @override
  Future<Either<Failure, void>> recoverPassword(String value) async {
    email = value;
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

  @override
  Future<Either<Failure, void>> deleteAccount() async {
    return const Right<Failure, void>(null);
  }

  @override
  Future<Either<Failure, void>> signOut() async {
    return const Right<Failure, void>(null);
  }
}
