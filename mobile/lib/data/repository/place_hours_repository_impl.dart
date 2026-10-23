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
  Future<Either<Failure, String>> save({
    required String placeId,
    required PlaceWeek week,
  }) async {
    try {
      final dynamic result = await _client.setPlaceHours(<String, dynamic>{
        'p_place': placeId,
        'p_week': week.periods
            .map(
              (OpeningPeriod period) => <String, dynamic>{
                'weekday': period.weekday,
                'opens': period.opens,
                'closes': period.closes,
              },
            )
            .toList(growable: false),
      });
      return Right<Failure, String>('$result');
    } on DioException catch (error) {
      return Left<Failure, String>(mapSupabaseException(error));
    }
  }

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
