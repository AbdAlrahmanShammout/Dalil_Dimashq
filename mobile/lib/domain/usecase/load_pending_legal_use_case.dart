import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/legal_document.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/legal_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadPendingLegalUseCase {
  LoadPendingLegalUseCase(this._repository);

  final LegalRepository _repository;

  Future<Either<Failure, List<LegalDocument>>> call() {
    return _repository.pending();
  }
}
