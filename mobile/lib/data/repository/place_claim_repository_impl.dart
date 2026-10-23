import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_claim_repository.dart';

@LazySingleton(as: PlaceClaimRepository)
class PlaceClaimRepositoryImpl implements PlaceClaimRepository {
  PlaceClaimRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, bool>> claimWithCode({
    required String placeId,
    required String code,
  }) async {
    try {
      final dynamic result = await _client.claimWithCode(<String, dynamic>{
        'p_place': placeId,
        'p_code': code,
      });
      return Right<Failure, bool>(result == true);
    } on DioException catch (error) {
      return Left<Failure, bool>(mapSupabaseException(error));
    }
  }
}
