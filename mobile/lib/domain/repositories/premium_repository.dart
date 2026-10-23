import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PremiumRepository {
  Future<Either<Failure, PremiumStatus>> load(DateTime now);
}
