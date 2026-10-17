import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SignInUseCase {
  SignInUseCase(this._repository);

  final AuthRepository _repository;

  Future<Either<Failure, void>> call(SignInRequest request) {
    return _repository.signIn(request);
  }
}
