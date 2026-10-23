import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class AuthRepository {
  Future<Either<Failure, void>> signUp(SignUpRequest request);

  Future<Either<Failure, void>> signIn(SignInRequest request);

  Future<Either<Failure, void>> recoverPassword(String email);

  Future<Either<Failure, void>> deleteAccount();

  Future<Either<Failure, void>> signOut();
}
