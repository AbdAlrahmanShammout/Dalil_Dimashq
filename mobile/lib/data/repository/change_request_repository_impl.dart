import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';

@LazySingleton(as: ChangeRequestRepository)
class ChangeRequestRepositoryImpl implements ChangeRequestRepository {
  ChangeRequestRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, List<PlaceChangeRequest>>> list(String placeId) async {
    try {
      final dynamic rows = await _client.placeChangeRequests(
        'eq.$placeId',
        'id,kind,status,decision_note',
        'created_at.desc',
      );
      return Right<Failure, List<PlaceChangeRequest>>(_map(rows));
    } on DioException catch (error) {
      return Left<Failure, List<PlaceChangeRequest>>(
        mapSupabaseException(error),
      );
    }
  }

  List<PlaceChangeRequest> _map(dynamic raw) {
    if (raw is! List) {
      return const <PlaceChangeRequest>[];
    }
    return raw.whereType<Map>().map((Map item) {
      final Map<String, dynamic> json = Map<String, dynamic>.from(item);
      return PlaceChangeRequest(
        id: json['id'] as int? ?? 0,
        kind: '${json['kind'] ?? ''}',
        status: '${json['status'] ?? ''}',
        decisionNote: json['decision_note'] as String?,
      );
    }).toList(growable: false);
  }

  @override
  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  }) async {
    try {
      await _client.insertChangeRequest(<String, dynamic>{
        'place_id': placeId,
        'kind': kind,
        'changes': changes,
        if (message != null && message.isNotEmpty) 'message': message,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
