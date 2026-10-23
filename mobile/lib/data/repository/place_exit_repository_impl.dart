import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_exit_repository.dart';

@LazySingleton(as: PlaceExitRepository)
class PlaceExitRepositoryImpl implements PlaceExitRepository {
  PlaceExitRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, int>> unlink({
    required String placeId,
    required String reason,
  }) async {
    try {
      final dynamic result = await _client.requestUnlink(<String, dynamic>{
        'p_place': placeId,
        'p_reason': reason,
      });
      final int id = result is int ? result : int.tryParse('$result') ?? 0;
      return Right<Failure, int>(id);
    } on DioException catch (error) {
      return Left<Failure, int>(mapSupabaseException(error));
    }
  }
}
