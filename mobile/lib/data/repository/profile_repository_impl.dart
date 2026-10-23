import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/profile_api_client.dart';
import 'package:dalil_dimashq/data/dto/profile_change_request_dto.dart';
import 'package:dalil_dimashq/data/dto/profile_dto.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

const String _profileSelect =
    'display_name,first_name,last_name,phone,birth_year,language,completed_at';

@LazySingleton(as: ProfileRepository)
class ProfileRepositoryImpl implements ProfileRepository {
  ProfileRepositoryImpl(this._client);

  final ProfileApiClient _client;

  @override
  Future<Either<Failure, UserProfile>> load() {
    return _load();
  }

  @override
  Future<Either<Failure, UserProfile>> complete(ProfileDraft draft) async {
    try {
      await _client.completeProfile(<String, dynamic>{
        'p_first_name': draft.firstName.trim(),
        'p_last_name': draft.lastName.trim(),
        'p_phone': draft.phone.trim(),
        'p_birth_year': draft.birthYear,
        'p_language': draft.language,
      });
      return _load();
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, UserProfile>> updatePhone({
    required String phone,
    required String language,
  }) async {
    try {
      await _client.updateMyProfile(<String, dynamic>{
        'p_phone': phone.trim(),
        'p_language': language,
      });
      return _load();
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, UserProfile>> requestChange(ProfileDraft draft) async {
    try {
      await _client.requestProfileChange(<String, dynamic>{
        'p_first_name': draft.firstName.trim(),
        'p_last_name': draft.lastName.trim(),
        'p_birth_year': draft.birthYear,
      });
      return _load();
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  Future<Either<Failure, UserProfile>> _load() async {
    try {
      final List<ProfileDto> rows = await _client.profiles(_profileSelect);
      final List<ProfileChangeRequestDto> pending = await _client
          .pendingProfileChanges(
        'eq.pending',
        'id',
      );
      if (rows.isEmpty) {
        return const Right(UserProfile());
      }
      return Right(rows.first.toEntity(hasPendingChange: pending.isNotEmpty));
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
