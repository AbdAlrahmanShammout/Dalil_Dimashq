import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/search_places_request_dto.dart';
import 'package:dalil_dimashq/data/dto/amenity_dto.dart';
import 'package:dalil_dimashq/data/repository/place_detail_mapper.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
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
      final page = response.toEntity();
      final Map<String, bool> openNow = await _openNow(
        page.places.map((place) => place.id).toList(),
      );
      return Right(
        PlaceSearchPage(
          places: page.places
              .map((place) => place.withOpenNow(openNow[place.id]))
              .toList(),
          total: page.total,
          counts: page.counts,
        ),
      );
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
      final Set<String> codes = (await _remote.amenityCodes(id)).toSet();
      final List<Amenity> amenities = (await _remote.amenities())
          .where((AmenityDto amenity) => codes.contains(amenity.code))
          .map((AmenityDto amenity) => amenity.toEntity())
          .toList();
      final hours = await _remote.regularHours(id);
      final Map<String, bool> openNow = await _openNow(<String>[id]);
      return Right(
        mapPlaceHeader(
          place: place,
          area: area,
          isFeatured: featured.isNotEmpty,
          coverPath: coverPathOf(photos),
          logoPath: logoPathOf(photos),
          offers: offers,
          photos: photos,
          amenities: amenities,
          hours: hours,
          openNow: openNow[id],
        ),
      );
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  Future<Map<String, bool>> _openNow(List<String> placeIds) async {
    try {
      return await _remote.openNow(placeIds);
    } on DioException {
      return <String, bool>{};
    }
  }
}
