import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class ProfileRepository {
  Future<Either<Failure, UserProfile>> load();

  Future<Either<Failure, UserProfile>> complete(ProfileDraft draft);

  Future<Either<Failure, UserProfile>> updatePhone({
    required String phone,
    required String language,
  });

  Future<Either<Failure, UserProfile>> requestChange(ProfileDraft draft);
}
