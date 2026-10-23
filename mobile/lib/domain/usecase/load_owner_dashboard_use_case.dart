import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_dashboard_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadOwnerDashboardUseCase {
  LoadOwnerDashboardUseCase(this._repository);

  final OwnerDashboardRepository _repository;

  Future<Either<Failure, OwnerDashboard>> call(String placeId) =>
      _repository.load(placeId);
}
