import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class CompleteProfileUseCase {
  CompleteProfileUseCase(this._repository);

  final ProfileRepository _repository;

  Future<Either<Failure, UserProfile>> call(ProfileDraft draft) {
    return _repository.complete(draft);
  }
}
