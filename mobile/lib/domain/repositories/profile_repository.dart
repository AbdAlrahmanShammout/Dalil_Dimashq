import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class ProfileRepository {
  Future<Either<Failure, UserProfile>> load();

  Future<Either<Failure, UserProfile>> save(UserProfile profile);
}
