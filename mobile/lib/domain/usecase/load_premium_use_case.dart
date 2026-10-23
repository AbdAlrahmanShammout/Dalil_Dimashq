import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadPremiumUseCase {
  LoadPremiumUseCase(this._repository);

  final PremiumRepository _repository;

  Future<Either<Failure, PremiumStatus>> call(DateTime now) =>
      _repository.load(now);
}
