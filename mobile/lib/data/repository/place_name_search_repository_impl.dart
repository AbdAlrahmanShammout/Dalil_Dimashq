import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/data/repository/owner_place_repository_impl.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_name_search_repository.dart';

@LazySingleton(as: PlaceNameSearchRepository)
class PlaceNameSearchRepositoryImpl implements PlaceNameSearchRepository {
  PlaceNameSearchRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, List<OwnedPlace>>> byName(String filter) async {
    try {
      final dynamic rows = await _client.placesByName(filter, ownedPlaceSelect);
      return Right<Failure, List<OwnedPlace>>(mapOwnedPlaces(rows));
    } on DioException catch (error) {
      return Left<Failure, List<OwnedPlace>>(mapSupabaseException(error));
    }
  }
}
