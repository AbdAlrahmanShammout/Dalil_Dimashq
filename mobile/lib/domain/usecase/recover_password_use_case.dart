import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class RecoverPasswordUseCase {
  RecoverPasswordUseCase(this._repository);

  final AuthRepository _repository;

  Future<Either<Failure, void>> call(String email) {
    final String value = email.trim();
    if (!value.contains('@') || !value.contains('.')) {
      return Future<Either<Failure, void>>.value(
        const Left(ValidationFailure('invalid_email')),
      );
    }
    return _repository.recoverPassword(value);
  }
}
