import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/notification_api_client.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/device_repository.dart';

@LazySingleton(as: DeviceRepository)
class DeviceRepositoryImpl implements DeviceRepository {
  DeviceRepositoryImpl(this._client);

  final NotificationApiClient _client;

  @override
  Future<Either<Failure, void>> register({
    required String token,
    required String platform,
  }) async {
    try {
      await _client.registerDevice(<String, dynamic>{
        'p_token': token,
        'p_platform': platform,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
