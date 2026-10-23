import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dalil_dimashq/domain/usecase/sign_up_use_case.dart';

void main() {
  test('a short password never reaches the server', () async {
    final _RecordingAuth repository = _RecordingAuth();
    final SignUpUseCase useCase = SignUpUseCase(repository);
    final Either<Failure, void> result = await useCase(
      const SignUpRequest(
        email: 'nour@example.com',
        password: 'abc123',
        displayName: 'Nour',
        isAtLeast16: true,
      ),
    );
    expect(
      result.fold((Failure failure) => failure, (_) => null),
      isA<WeakPasswordFailure>(),
    );
    expect(repository.calls, 0);
  });

  test('letters and digits of 10 or more create the account', () async {
    final _RecordingAuth repository = _RecordingAuth();
    final SignUpUseCase useCase = SignUpUseCase(repository);
    final Either<Failure, void> result = await useCase(
      const SignUpRequest(
        email: 'nour@example.com',
        password: 'كلمة1234567',
        displayName: 'Nour',
        isAtLeast16: true,
      ),
    );
    expect(result.isRight(), isTrue);
    expect(repository.calls, 1);
    expect(repository.last?.displayName, 'Nour');
  });

  test('account creation requires age 16 or older', () async {
    final _RecordingAuth repository = _RecordingAuth();
    final SignUpUseCase useCase = SignUpUseCase(repository);
    final Either<Failure, void> result = await useCase(
      const SignUpRequest(
        email: 'nour@example.com',
        password: 'abc1234567',
        displayName: 'Nour',
        isAtLeast16: false,
      ),
    );
    expect(
      result.fold((Failure failure) => failure, (_) => null),
      isA<AgeCheckFailure>(),
    );
    expect(repository.calls, 0);
  });
}

class _RecordingAuth implements AuthRepository {
  int calls = 0;
  SignUpRequest? last;

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    calls += 1;
    last = request;
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

  @override
  Future<Either<Failure, void>> deleteAccount() async {
    return const Right<Failure, void>(null);
  }
}
