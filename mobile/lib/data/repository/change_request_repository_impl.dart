import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';

@LazySingleton(as: ChangeRequestRepository)
class ChangeRequestRepositoryImpl implements ChangeRequestRepository {
  ChangeRequestRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  }) async {
    try {
      await _client.insertChangeRequest(<String, dynamic>{
        'place_id': placeId,
        'kind': kind,
        'changes': changes,
        if (message != null && message.isNotEmpty) 'message': message,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
