import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/offer_dto.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/offer_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: OfferRepository)
class OfferRepositoryImpl implements OfferRepository {
  OfferRepositoryImpl(this._remote);

  final DirectoryRemoteDataSource _remote;

  @override
  Future<Either<Failure, List<PlaceOffer>>> list() async {
    try {
      final List<PlaceOffer> offers = (await _remote.listOffers())
          .map((OfferDto offer) => offer.toEntity())
          .toList();
      return Right(offers);
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
