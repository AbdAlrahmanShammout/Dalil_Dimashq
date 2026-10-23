import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/suggestion.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/submit_suggestion_use_case.dart';

abstract class SuggestionEvent {
  const SuggestionEvent();
}

class SuggestionSubmitted extends SuggestionEvent {
  const SuggestionSubmitted(this.suggestion);

  final Suggestion suggestion;
}

class SuggestionState {
  const SuggestionState({this.isWaiting = false, this.errorCode});

  final bool isWaiting;
  final String? errorCode;
}

@injectable
class SuggestionBloc extends Bloc<SuggestionEvent, SuggestionState> {
  SuggestionBloc(this._submit) : super(const SuggestionState()) {
    on<SuggestionSubmitted>(_onSubmitted);
  }

  final SubmitSuggestionUseCase _submit;

  Future<void> _onSubmitted(
    SuggestionSubmitted event,
    Emitter<SuggestionState> emit,
  ) async {
    final Either<Failure, void> result = await _submit(event.suggestion);
    result.fold(
      (Failure failure) => emit(
        SuggestionState(
          isWaiting: failure.message == 'suggestion_kind_pending',
          errorCode: failure.message,
        ),
      ),
      (_) => emit(const SuggestionState()),
    );
  }
}
