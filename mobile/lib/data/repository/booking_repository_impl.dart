import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/booking_api_client.dart';
import 'package:dalil_dimashq/data/dto/booking_availability_dto.dart';
import 'package:dalil_dimashq/data/dto/booking_summary_dto.dart';
import 'package:dalil_dimashq/domain/entities/booking_availability.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
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

  @override
  Future<Either<Failure, int>> create(BookingRequest request) async {
    try {
      final dynamic raw = await _client.createBooking(<String, dynamic>{
        'p_place': request.placeId,
        'p_at': request.at.toUtc().toIso8601String(),
        'p_party': request.party,
        'p_name': request.name,
        'p_phone': request.phone,
        'p_client_key': request.clientKey,
        if (request.note != null && request.note!.isNotEmpty)
          'p_note': request.note,
      });
      final int? id = raw is int ? raw : int.tryParse('$raw');
      if (id == null) {
        return const Left<Failure, int>(ServerFailure('missing booking'));
      }
      return Right<Failure, int>(id);
    } on DioException catch (error) {
      return Left<Failure, int>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, BookingSummary>> find(int id) async {
    try {
      final dynamic raw = await _client.bookingById(
        'eq.$id',
        'id,place_id,booking_at,party_size,note,current_status,reason,reported',
      );
      final List<dynamic> rows = raw is List<dynamic> ? raw : <dynamic>[];
      final BookingSummary? booking = rows.isEmpty
          ? null
          : mapBookingSummary(rows.first);
      if (booking == null) {
        return const Left<Failure, BookingSummary>(
          NotFoundFailure('booking_not_found'),
        );
      }
      return Right<Failure, BookingSummary>(booking);
    } on DioException catch (error) {
      return Left<Failure, BookingSummary>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, List<BookingSummary>>> list() async {
    try {
      final dynamic raw = await _client.bookings(
        'id,place_id,booking_at,party_size,note,current_status,reason,reported',
        'booking_at.desc',
      );
      return Right<Failure, List<BookingSummary>>(mapBookingList(raw));
    } on DioException catch (error) {
      return Left<Failure, List<BookingSummary>>(mapSupabaseException(error));
    }
  }
}
