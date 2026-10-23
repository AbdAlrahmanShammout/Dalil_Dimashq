import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/reviewed_place_changes.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/submit_reviewed_changes_use_case.dart';

abstract class ReviewedChangesEvent {
  const ReviewedChangesEvent();
}

class ReviewedChangesSubmitted extends ReviewedChangesEvent {
  const ReviewedChangesSubmitted({required this.placeId, required this.changes});

  final String placeId;
  final ReviewedPlaceChanges changes;
}

class ReviewedChangesState {
  const ReviewedChangesState({this.isSent = false});

  final bool isSent;
}

@injectable
class ReviewedChangesBloc
    extends Bloc<ReviewedChangesEvent, ReviewedChangesState> {
  ReviewedChangesBloc(this._submit) : super(const ReviewedChangesState()) {
    on<ReviewedChangesSubmitted>(_onSubmitted);
  }

  final SubmitReviewedChangesUseCase _submit;

  Future<void> _onSubmitted(
    ReviewedChangesSubmitted event,
    Emitter<ReviewedChangesState> emit,
  ) async {
    final Either<Failure, void> result = await _submit(
      placeId: event.placeId,
      changes: event.changes,
    );
    result.fold((Failure failure) {}, (void _) {
      emit(const ReviewedChangesState(isSent: true));
    });
  }
}
