import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/offer_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListOffersUseCase {
  ListOffersUseCase(this._repository);

  final OfferRepository _repository;

  Future<Either<Failure, List<PlaceOffer>>> call() => _repository.list();
}
