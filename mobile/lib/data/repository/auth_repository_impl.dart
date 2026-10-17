import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(this._client);

  final AuthApiClient _client;

  @override
  Future<Either<Failure, void>> signUp(SignUpRequest request) async {
    try {
      await _client.signUp(<String, dynamic>{
        'email': request.email.trim(),
        'password': request.password,
        'data': <String, dynamic>{'display_name': request.displayName.trim()},
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
