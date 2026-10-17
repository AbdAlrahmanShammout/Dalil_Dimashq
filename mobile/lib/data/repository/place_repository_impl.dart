import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/search_places_request_dto.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: PlaceRepository)
class PlaceRepositoryImpl implements PlaceRepository {
  PlaceRepositoryImpl(this._remote);

  final DirectoryRemoteDataSource _remote;

  @override
  Future<Either<Failure, PlaceSearchPage>> search(
    PlaceSearchQuery query,
  ) async {
    try {
      final response = await _remote.search(
        SearchPlacesRequestDto.fromQuery(query),
      );
      return Right(response.toEntity());
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
