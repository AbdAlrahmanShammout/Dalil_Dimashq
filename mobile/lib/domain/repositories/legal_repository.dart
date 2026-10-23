import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/legal_document.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class LegalRepository {
  Future<Either<Failure, List<LegalDocument>>> pending();

  Future<Either<Failure, void>> accept(int documentId);
}
