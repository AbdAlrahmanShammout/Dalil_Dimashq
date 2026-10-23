import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/notification_api_client.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';

@LazySingleton(as: NotificationRepository)
class NotificationRepositoryImpl implements NotificationRepository {
  NotificationRepositoryImpl(this._client);

  final NotificationApiClient _client;

  @override
  Future<Either<Failure, List<AppNotification>>> list() async {
    try {
      final dynamic raw = await _client.notifications(
        'id,kind,booking_id,created_at,read_at',
        'created_at.desc',
      );
      if (raw is! List) {
        return const Right<Failure, List<AppNotification>>(<AppNotification>[]);
      }
      return Right<Failure, List<AppNotification>>(
        raw.whereType<Map>().map((Map item) {
          final Map<String, dynamic> json = Map<String, dynamic>.from(item);
          final int id = json['id'] is int
              ? json['id'] as int
              : int.parse('${json['id']}');
          return AppNotification(
            id: id,
            kind: '${json['kind']}',
            bookingId: json['booking_id'] is int
                ? json['booking_id'] as int
                : int.tryParse('${json['booking_id']}'),
            readAt: DateTime.tryParse('${json['read_at'] ?? ''}'),
          );
        }).toList(growable: false),
      );
    } on DioException catch (error) {
      return Left<Failure, List<AppNotification>>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> markRead(int id, DateTime at) async {
    try {
      await _client.markRead('eq.$id', <String, dynamic>{
        'read_at': at.toUtc().toIso8601String(),
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
