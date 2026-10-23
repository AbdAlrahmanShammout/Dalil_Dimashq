import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class UpdateProfilePhoneUseCase {
  UpdateProfilePhoneUseCase(this._repository);

  final ProfileRepository _repository;

  Future<Either<Failure, UserProfile>> call({
    required String phone,
    required String language,
  }) {
    return _repository.updatePhone(phone: phone, language: language);
  }
}
