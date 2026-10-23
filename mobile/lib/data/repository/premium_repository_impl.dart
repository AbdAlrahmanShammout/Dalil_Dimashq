import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';

@LazySingleton(as: PremiumRepository)
class PremiumRepositoryImpl implements PremiumRepository {
  PremiumRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    try {
      final dynamic subscriptions = await _client.subscriptions('ends_at');
      final dynamic pending = await _client.changeRequests(
        'eq.pending',
        'id',
      );
      return Right<Failure, PremiumStatus>(
        resolvePremiumStatus(
          endsAt: _ends(subscriptions),
          pendingRequests: _count(pending),
          now: now,
        ),
      );
    } on DioException catch (error) {
      return Left<Failure, PremiumStatus>(mapSupabaseException(error));
    }
  }

  List<DateTime?> _ends(dynamic raw) {
    if (raw is! List) {
      return const <DateTime?>[];
    }
    return raw.whereType<Map>().map((Map item) {
      final Object? value = Map<String, dynamic>.from(item)['ends_at'];
      if (value is! String) {
        return null;
      }
      return DateTime.tryParse(value);
    }).toList(growable: false);
  }

  int _count(dynamic raw) {
    if (raw is! List) {
      return 0;
    }
    return raw.length;
  }
}
