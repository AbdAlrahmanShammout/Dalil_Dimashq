import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/suggestion.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/suggestion_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class SubmitSuggestionUseCase {
  SubmitSuggestionUseCase(this._repository);

  final SuggestionRepository _repository;

  Future<Either<Failure, void>> call(Suggestion suggestion) {
    if (Suggestion.kinds.isEmpty) {
      return Future<Either<Failure, void>>.value(
        const Left<Failure, void>(ValidationFailure('suggestion_kind_pending')),
      );
    }
    return _repository.send(suggestion, Suggestion.kinds.first);
  }
}
