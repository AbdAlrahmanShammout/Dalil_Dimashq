import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/auth_failure_mapper.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart';
import 'package:dalil_dimashq/data/dto/session_dto.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(this._client, this._tokenStorage);

  final AuthApiClient _client;
  final TokenStorage _tokenStorage;

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

  @override
  Future<Either<Failure, void>> signIn(SignInRequest request) async {
    try {
      final SessionDto session = await _client.signIn(
        'password',
        <String, dynamic>{
          'email': request.email.trim(),
          'password': request.password,
        },
      );
      if (session.accessToken.isEmpty) {
        return const Left<Failure, void>(ServerFailure('missing token'));
      }
      await _tokenStorage.saveToken(session.accessToken);
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapAuthException(error));
    }
  }

  @override
  Future<Either<Failure, void>> deleteAccount() async {
    try {
      await _client.deleteAccount();
      await _tokenStorage.clearToken();
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> recoverPassword(String email) async {
    try {
      await _client.recover(<String, dynamic>{'email': email.trim()});
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapAuthException(error));
    }
  }
}
