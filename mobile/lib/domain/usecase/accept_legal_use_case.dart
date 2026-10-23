import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/legal_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class AcceptLegalUseCase {
  AcceptLegalUseCase(this._repository);

  final LegalRepository _repository;

  Future<Either<Failure, void>> call(int documentId) {
    return _repository.accept(documentId);
  }
}
