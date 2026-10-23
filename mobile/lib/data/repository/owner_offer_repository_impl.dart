import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart';
import 'package:dalil_dimashq/domain/entities/owner_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_offer_repository.dart';

@LazySingleton(as: OwnerOfferRepository)
class OwnerOfferRepositoryImpl implements OwnerOfferRepository {
  OwnerOfferRepositoryImpl(this._client);

  final OwnerApiClient _client;

  @override
  Future<Either<Failure, void>> create({
    required String placeId,
    required OwnerOffer offer,
  }) async {
    try {
      await _client.insertOffer(<String, dynamic>{
        'place_id': placeId,
        'title_ar': offer.titleAr,
        'details_ar': offer.detailsAr,
        'starts_at': offer.startsAt.toUtc().toIso8601String(),
        'ends_at': offer.endsAt.toUtc().toIso8601String(),
        if (offer.photoPath != null && offer.photoPath!.isNotEmpty)
          'photo_path': offer.photoPath,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> stop({
    required int offerId,
    required DateTime endsAt,
  }) async {
    try {
      await _client.updateOffer('eq.$offerId', <String, dynamic>{
        'ends_at': endsAt.toUtc().toIso8601String(),
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> delete(int offerId) async {
    try {
      await _client.deleteOffer('eq.$offerId');
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
