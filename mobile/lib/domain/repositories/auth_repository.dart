import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class AuthRepository {
  Future<Either<Failure, void>> signUp(SignUpRequest request);

  Future<Either<Failure, void>> signIn(SignInRequest request);
}
