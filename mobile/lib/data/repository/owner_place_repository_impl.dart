import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_place_repository.dart';

const String ownedPlaceSelect = 'id,name_ar,name_en,type,address';

@LazySingleton(as: OwnerPlaceRepository)
class OwnerPlaceRepositoryImpl implements OwnerPlaceRepository {
  OwnerPlaceRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, List<OwnedPlace>>> list() async {
    try {
      final dynamic owners = await _client.placeOwners('place_id');
      final List<String> ids = _ids(owners);
      if (ids.isEmpty) {
        return const Right<Failure, List<OwnedPlace>>(<OwnedPlace>[]);
      }
      final dynamic rows = await _client.places(
        'in.(${ids.join(',')})',
        ownedPlaceSelect,
      );
      return Right<Failure, List<OwnedPlace>>(_places(rows));
    } on DioException catch (error) {
      return Left<Failure, List<OwnedPlace>>(mapSupabaseException(error));
    }
  }

  List<String> _ids(dynamic raw) {
    if (raw is! List) {
      return const <String>[];
    }
    return raw.whereType<Map>().map((Map item) {
      final Map<String, dynamic> json = Map<String, dynamic>.from(item);
      return '${json['place_id']}';
    }).where((String id) => id.isNotEmpty).toList(growable: false);
  }

  List<OwnedPlace> _places(dynamic raw) {
    if (raw is! List) {
      return const <OwnedPlace>[];
    }
    return raw.whereType<Map>().map((Map item) {
      final Map<String, dynamic> json = Map<String, dynamic>.from(item);
      return OwnedPlace(
        id: '${json['id']}',
        nameAr: '${json['name_ar'] ?? ''}',
        nameEn: json['name_en'] as String?,
        type: '${json['type'] ?? ''}',
        address: json['address'] as String?,
      );
    }).toList(growable: false);
  }
}
