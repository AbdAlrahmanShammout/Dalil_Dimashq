import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_hours_repository.dart';

@LazySingleton(as: PlaceHoursRepository)
class PlaceHoursRepositoryImpl implements PlaceHoursRepository {
  PlaceHoursRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, PlaceWeek>> load(String placeId) async {
    try {
      final dynamic rows = await _client.placeHours(
        'eq.$placeId',
        'weekday,opens,closes,season',
      );
      final List<Map<String, dynamic>> maps = rows is List
          ? rows
              .whereType<Map>()
              .map((Map item) => Map<String, dynamic>.from(item))
              .toList(growable: false)
          : const <Map<String, dynamic>>[];
      return Right<Failure, PlaceWeek>(
        PlaceWeek(periods: regularOpeningPeriods(maps)),
      );
    } on DioException catch (error) {
      return Left<Failure, PlaceWeek>(mapSupabaseException(error));
    }
  }
}
