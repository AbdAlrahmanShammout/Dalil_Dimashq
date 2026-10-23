import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/booking_api_client.dart';
import 'package:dalil_dimashq/data/dto/booking_availability_dto.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';

@LazySingleton(as: BookingRepository)
class BookingRepositoryImpl implements BookingRepository {
  BookingRepositoryImpl(this._client);

  final BookingApiClient _client;

  @override
  Future<Either<Failure, BookingAvailability>> availability(
    String placeId,
  ) async {
    try {
      final dynamic raw = await _client.bookingAvailability(<String, dynamic>{
        'p_place': placeId,
      });
      return Right<Failure, BookingAvailability>(mapBookingAvailability(raw));
    } on DioException catch (error) {
      return Left<Failure, BookingAvailability>(mapSupabaseException(error));
    }
  }
}
