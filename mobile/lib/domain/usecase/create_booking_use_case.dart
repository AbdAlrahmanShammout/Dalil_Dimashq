import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart';
import 'package:dalil_dimashq/domain/services/booking_client_key.dart';
import 'package:injectable/injectable.dart';

@injectable
class CreateBookingUseCase {
  CreateBookingUseCase(this._repository);

  final BookingRepository _repository;

  Future<Either<Failure, int>> call(
    BookingRequest request, {
    required int maxParty,
  }) {
    if (request.party < 1 || request.party > maxParty) {
      return Future<Either<Failure, int>>.value(
        const Left<Failure, int>(ValidationFailure('party_too_large')),
      );
    }
    if ((request.note ?? '').length > BookingRequest.maxNoteLength) {
      return Future<Either<Failure, int>>.value(
        const Left<Failure, int>(ValidationFailure('note_too_long')),
      );
    }
    return _repository.create(
      BookingRequest(
        placeId: request.placeId,
        at: request.at,
        party: request.party,
        name: request.name,
        phone: request.phone,
        clientKey: request.clientKey.isEmpty
            ? newBookingClientKey()
            : request.clientKey,
        note: request.note,
      ),
    );
  }
}