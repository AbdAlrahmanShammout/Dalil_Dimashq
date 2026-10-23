import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class ChangeRequestRepository {
  Future<Either<Failure, List<PlaceChangeRequest>>> list(String placeId);

  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  });
}
