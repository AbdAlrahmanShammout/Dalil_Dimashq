import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/profile_api_client.dart';
import 'package:dalil_dimashq/data/dto/profile_dto.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

const String _profileSelect = 'display_name,phone';
const String _returnRepresentation = 'return=representation';

@LazySingleton(as: ProfileRepository)
class ProfileRepositoryImpl implements ProfileRepository {
  ProfileRepositoryImpl(this._client);

  final ProfileApiClient _client;

  @override
  Future<Either<Failure, UserProfile>> load() async {
    try {
      final List<ProfileDto> rows = await _client.profiles(_profileSelect);
      return Right(_firstProfile(rows));
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, UserProfile>> save(UserProfile profile) async {
    try {
      final List<ProfileDto> rows = await _client.updateProfile(
        <String, dynamic>{
          'display_name': profile.displayName.trim(),
          'phone': profile.phone.trim(),
        },
        _returnRepresentation,
      );
      return Right(_firstProfile(rows));
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  UserProfile _firstProfile(List<ProfileDto> rows) {
    if (rows.isEmpty) {
      return const UserProfile(displayName: '', phone: '');
    }
    return rows.first.toEntity();
  }
}
