import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/booking_api_client.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_booking_repository.dart';

const String ownerBookingSelect =
    'id,customer_name,customer_phone,party_size,booking_at,note,current_status,reported';

@LazySingleton(as: OwnerBookingRepository)
class OwnerBookingRepositoryImpl implements OwnerBookingRepository {
  OwnerBookingRepositoryImpl(this._client);

  final BookingApiClient _client;

  @override
  Future<Either<Failure, List<OwnerBooking>>> list(String placeId) async {
    try {
      final dynamic rows = await _client.placeBookings(
        'eq.$placeId',
        ownerBookingSelect,
        'booking_at.desc',
      );
      return Right<Failure, List<OwnerBooking>>(_map(rows));
    } on DioException catch (error) {
      return Left<Failure, List<OwnerBooking>>(mapSupabaseException(error));
    }
  }

  List<OwnerBooking> _map(dynamic raw) {
    if (raw is! List) {
      return const <OwnerBooking>[];
    }
    return raw.whereType<Map>().map((Map item) {
      final Map<String, dynamic> json = Map<String, dynamic>.from(item);
      return OwnerBooking(
        id: json['id'] as int? ?? 0,
        customerName: '${json['customer_name'] ?? ''}',
        customerPhone: '${json['customer_phone'] ?? ''}',
        party: json['party_size'] as int? ?? 0,
        at: DateTime.tryParse('${json['booking_at']}') ??
            DateTime.fromMillisecondsSinceEpoch(0, isUtc: true),
        note: json['note'] as String?,
        status: '${json['current_status'] ?? json['status'] ?? ''}',
        reported: json['reported'] == true,
      );
    }).toList(growable: false);
  }
}
