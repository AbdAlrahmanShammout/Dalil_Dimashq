import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class OwnerDashboardRepository {
  Future<Either<Failure, OwnerDashboard>> load(String placeId);
}
