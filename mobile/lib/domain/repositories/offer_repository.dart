import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class OfferRepository {
  Future<Either<Failure, List<PlaceOffer>>> list();
}
