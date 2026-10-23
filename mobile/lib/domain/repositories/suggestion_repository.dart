import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/suggestion.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class SuggestionRepository {
  Future<Either<Failure, void>> send(Suggestion suggestion, String kind);
}
