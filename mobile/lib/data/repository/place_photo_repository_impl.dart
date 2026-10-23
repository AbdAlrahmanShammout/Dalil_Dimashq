import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_photo_repository.dart';

@LazySingleton(as: PlacePhotoRepository)
class PlacePhotoRepositoryImpl implements PlacePhotoRepository {
  PlacePhotoRepositoryImpl(this._dio, this._client);

  final Dio _dio;
  final OwnerApiClient _client;

  @override
  Future<Either<Failure, void>> upload({
    required String placeId,
    required String name,
    required List<int> bytes,
  }) async {
    final String path = '$placeId/$name';
    try {
      await _dio.post<void>(
        '/storage/v1/object/place-photos/$path',
        data: bytes,
        options: Options(contentType: 'image/jpeg'),
      );
      await _client.insertPhoto(<String, dynamic>{
        'place_id': placeId,
        'storage_path': path,
        'by_owner': true,
        'sort': 0,
        'hidden': false,
        'is_cover': false,
        'is_logo': false,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
