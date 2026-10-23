import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_offer.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_offer_repository.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ManageOwnerOfferUseCase {
  ManageOwnerOfferUseCase(this._premium, this._repository);

  final PremiumRepository _premium;
  final OwnerOfferRepository _repository;

  Future<Either<Failure, void>> create({
    required String placeId,
    required OwnerOffer offer,
    DateTime? now,
  }) async {
    if (!await _isPremium(now ?? DateTime.now())) {
      return const Left<Failure, void>(ValidationFailure('premium_required'));
    }
    if (!offer.fitsWindow) {
      return const Left<Failure, void>(ValidationFailure('offer_too_long'));
    }
    return _repository.create(placeId: placeId, offer: offer);
  }

  Future<Either<Failure, void>> stop({
    required int offerId,
    required DateTime endsAt,
    DateTime? now,
  }) async {
    if (!await _isPremium(now ?? DateTime.now())) {
      return const Left<Failure, void>(ValidationFailure('premium_required'));
    }
    return _repository.stop(offerId: offerId, endsAt: endsAt);
  }

  Future<Either<Failure, void>> delete(int offerId, {DateTime? now}) async {
    if (!await _isPremium(now ?? DateTime.now())) {
      return const Left<Failure, void>(ValidationFailure('premium_required'));
    }
    return _repository.delete(offerId);
  }

  Future<bool> _isPremium(DateTime now) async {
    final Either<Failure, PremiumStatus> premium = await _premium.load(now);
    return premium.getOrElse(
      () => const PremiumStatus(isActive: false, pendingRequests: 0),
    ).isActive;
  }
}
