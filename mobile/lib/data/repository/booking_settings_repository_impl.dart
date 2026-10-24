import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/booking_api_client.dart';
import 'package:dalil_dimashq/domain/entities/place_booking_settings.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_settings_repository.dart';

@LazySingleton(as: BookingSettingsRepository)
class BookingSettingsRepositoryImpl implements BookingSettingsRepository {
  BookingSettingsRepositoryImpl(this._client);

  final BookingApiClient _client;

  @override
  Future<Either<Failure, PlaceBookingSettings>> load(String placeId) async {
    try {
      final dynamic settings = await _client.bookingSettings(
        'eq.$placeId',
        'place_id,accepting,max_party,minimum_booking_notice_minutes',
      );
      final dynamic hours = await _client.responseHours(
        'eq.$placeId',
        'id,weekday,opens,closes',
        'weekday.asc',
      );
      final dynamic closures = await _client.blackouts(
        'eq.$placeId',
        'id,starts_at,ends_at,reason',
        'starts_at.asc',
      );
      return Right<Failure, PlaceBookingSettings>(
        PlaceBookingSettings(
          options: _options(settings),
          replyHours: _hours(hours),
          closures: _closures(closures),
        ),
      );
    } on DioException catch (error) {
      return Left<Failure, PlaceBookingSettings>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> saveOptions({
    required String placeId,
    required bool accepting,
    required int maxParty,
    required int minimumNoticeMinutes,
  }) {
    return _call(
      () => _client.setBookingOptions(<String, dynamic>{
        'p_place': placeId,
        'p_accepting': accepting,
        'p_max_party': maxParty,
        'p_minimum_notice_minutes': minimumNoticeMinutes,
      }),
    );
  }

  @override
  Future<Either<Failure, void>> addReplyHour({
    required String placeId,
    required int weekday,
    required String opens,
    required String closes,
  }) {
    return _call(
      () => _client.insertResponseHour(<String, dynamic>{
        'place_id': placeId,
        'weekday': weekday,
        'opens': opens,
        'closes': closes,
      }),
    );
  }

  @override
  Future<Either<Failure, void>> removeReplyHour(int id) {
    return _call(() => _client.deleteResponseHour('eq.$id'));
  }

  @override
  Future<Either<Failure, void>> addClosure({
    required String placeId,
    required DateTime startsAt,
    required DateTime endsAt,
    String? reason,
  }) {
    return _call(
      () => _client.insertBlackout(<String, dynamic>{
        'place_id': placeId,
        'starts_at': startsAt.toUtc().toIso8601String(),
        'ends_at': endsAt.toUtc().toIso8601String(),
        if (reason != null) 'reason': reason,
      }),
    );
  }

  @override
  Future<Either<Failure, void>> removeClosure(int id) {
    return _call(() => _client.deleteBlackout('eq.$id'));
  }

  Future<Either<Failure, void>> _call(Future<void> Function() action) async {
    try {
      await action();
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }

  BookingOptions _options(dynamic raw) {
    final List<Map<String, dynamic>> rows = _rows(raw);
    if (rows.isEmpty) {
      return const BookingOptions(
        accepting: false,
        maxParty: 1,
        minimumNoticeMinutes: 0,
      );
    }
    final Map<String, dynamic> json = rows.first;
    return BookingOptions(
      accepting: json['accepting'] == true,
      maxParty: json['max_party'] as int? ?? 1,
      minimumNoticeMinutes:
          json['minimum_booking_notice_minutes'] as int? ?? 0,
    );
  }

  List<ReplyHour> _hours(dynamic raw) {
    return _rows(raw).map((Map<String, dynamic> json) {
      return ReplyHour(
        id: json['id'] as int?,
        weekday: json['weekday'] as int? ?? 0,
        opens: '${json['opens'] ?? ''}',
        closes: '${json['closes'] ?? ''}',
      );
    }).toList(growable: false);
  }

  List<BookingClosure> _closures(dynamic raw) {
    return _rows(raw).map((Map<String, dynamic> json) {
      return BookingClosure(
        id: json['id'] as int?,
        startsAt: DateTime.tryParse('${json['starts_at']}') ??
            DateTime.fromMillisecondsSinceEpoch(0, isUtc: true),
        endsAt: DateTime.tryParse('${json['ends_at']}') ??
            DateTime.fromMillisecondsSinceEpoch(0, isUtc: true),
        reason: json['reason'] as String?,
      );
    }).toList(growable: false);
  }

  List<Map<String, dynamic>> _rows(dynamic raw) {
    if (raw is! List) {
      return const <Map<String, dynamic>>[];
    }
    return raw
        .whereType<Map>()
        .map((Map item) => Map<String, dynamic>.from(item))
        .toList(growable: false);
  }
}
