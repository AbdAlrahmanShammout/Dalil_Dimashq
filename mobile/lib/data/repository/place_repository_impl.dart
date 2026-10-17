import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/search_places_request_dto.dart';
import 'package:dalil_dimashq/data/repository/place_detail_mapper.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
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

  @override
  Future<Either<Failure, List<Area>>> areas() async {
    try {
      final List<Area> areas = (await _remote.areas())
          .map((area) => area.toEntity())
          .toList();
      return Right(areas);
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    try {
      final places = await _remote.placeById(id);
      if (places.isEmpty) {
        return Left(NotFoundFailure(id));
      }
      final place = places.first;
      final area = place.areaId == null
          ? null
          : (await _remote.areaById(place.areaId!)).firstOrNull;
      final featured = await _remote.featuredNow(id);
      final photos = await _remote.visiblePhotos(id);
      final offers = await _remote.offers(id);
      return Right(
        mapPlaceHeader(
          place: place,
          area: area,
          isFeatured: featured.isNotEmpty,
          coverPath: coverPathOf(photos),
          logoPath: logoPathOf(photos),
          offers: offers,
          photos: photos,
        ),
      );
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
