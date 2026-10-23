import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/data/repository/owner_place_repository_impl.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_dashboard_repository.dart';

@LazySingleton(as: OwnerDashboardRepository)
class OwnerDashboardRepositoryImpl implements OwnerDashboardRepository {
  OwnerDashboardRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, OwnerDashboard>> load(String placeId) async {
    try {
      final dynamic rows = await _client.places(
        'eq.$placeId',
        ownedPlaceSelect,
      );
      final List<OwnedPlace> places = mapOwnedPlaces(rows);
      if (places.isEmpty) {
        return const Left<Failure, OwnerDashboard>(
          NotFoundFailure('not_found'),
        );
      }
      return Right<Failure, OwnerDashboard>(
        OwnerDashboard(place: places.first),
      );
    } on DioException catch (error) {
      return Left<Failure, OwnerDashboard>(mapSupabaseException(error));
    }
  }
}
