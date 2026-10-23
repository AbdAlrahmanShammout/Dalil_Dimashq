import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/owner_amenities.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_amenity_repository.dart';

@LazySingleton(as: OwnerAmenityRepository)
class OwnerAmenityRepositoryImpl implements OwnerAmenityRepository {
  OwnerAmenityRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, OwnerAmenities>> load(String placeId) async {
    try {
      final dynamic catalog = await _client.amenities('code,name_ar,name_en,sort');
      final dynamic selected = await _client.placeAmenities(
        'eq.$placeId',
        'amenity',
      );
      return Right<Failure, OwnerAmenities>(
        OwnerAmenities(catalog: _catalog(catalog), selected: _selected(selected)),
      );
    } on DioException catch (error) {
      return Left<Failure, OwnerAmenities>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> add({
    required String placeId,
    required String code,
  }) async {
    try {
      await _client.insertPlaceAmenity(<String, dynamic>{
        'place_id': placeId,
        'amenity': code,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> remove({
    required String placeId,
    required String code,
  }) async {
    try {
      await _client.deletePlaceAmenity('eq.$placeId', 'eq.$code');
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }

  List<Amenity> _catalog(dynamic raw) {
    if (raw is! List) {
      return const <Amenity>[];
    }
    return raw.whereType<Map>().map((Map item) {
      final Map<String, dynamic> json = Map<String, dynamic>.from(item);
      return Amenity(
        code: '${json['code']}',
        nameAr: '${json['name_ar'] ?? ''}',
        nameEn: '${json['name_en'] ?? ''}',
      );
    }).toList(growable: false);
  }

  List<String> _selected(dynamic raw) {
    if (raw is! List) {
      return const <String>[];
    }
    return raw.whereType<Map>().map((Map item) {
      return '${Map<String, dynamic>.from(item)['amenity']}';
    }).toList(growable: false);
  }
}
