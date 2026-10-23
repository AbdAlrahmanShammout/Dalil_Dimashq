import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class OwnerOfferRepository {
  Future<Either<Failure, void>> create({
    required String placeId,
    required OwnerOffer offer,
  });

  Future<Either<Failure, void>> stop({
    required int offerId,
    required DateTime endsAt,
  });

  Future<Either<Failure, void>> delete(int offerId);
}
