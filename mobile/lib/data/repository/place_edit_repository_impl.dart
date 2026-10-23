import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/place_immediate_fields.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_edit_repository.dart';

@LazySingleton(as: PlaceEditRepository)
class PlaceEditRepositoryImpl implements PlaceEditRepository {
  PlaceEditRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, void>> saveImmediate({
    required String placeId,
    required PlaceImmediateFields fields,
  }) async {
    try {
      await _client.updatePlace('eq.$placeId', fields.toJson());
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
