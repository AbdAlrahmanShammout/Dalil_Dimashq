import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dalil_dimashq/domain/services/password_rule.dart';
import 'package:injectable/injectable.dart';

@injectable
class SignUpUseCase {
  SignUpUseCase(this._repository);

  final AuthRepository _repository;

  Future<Either<Failure, void>> call(SignUpRequest request) {
    if (!request.isAtLeast16) {
      return Future<Either<Failure, void>>.value(const Left(AgeCheckFailure()));
    }
    if (!isAcceptablePassword(request.password)) {
      return Future<Either<Failure, void>>.value(
        const Left(WeakPasswordFailure()),
      );
    }
    if (request.displayName.trim().isEmpty || !_looksLikeEmail(request.email)) {
      return Future<Either<Failure, void>>.value(
        const Left(ValidationFailure('invalid_account')),
      );
    }
    return _repository.signUp(request);
  }

  bool _looksLikeEmail(String email) {
    final String value = email.trim();
    return value.contains('@') && value.contains('.');
  }
}
