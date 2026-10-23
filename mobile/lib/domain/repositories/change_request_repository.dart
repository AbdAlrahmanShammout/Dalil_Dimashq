import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class ChangeRequestRepository {
  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  });
}
