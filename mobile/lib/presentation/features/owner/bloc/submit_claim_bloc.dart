import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/submit_claim_use_case.dart';

abstract class SubmitClaimEvent {
  const SubmitClaimEvent();
}

class SubmitClaimRequested extends SubmitClaimEvent {
  const SubmitClaimRequested(this.placeId);

  final String placeId;
}

class SubmitClaimState {
  const SubmitClaimState({this.isSent = false});

  final bool isSent;
}

@injectable
class SubmitClaimBloc extends Bloc<SubmitClaimEvent, SubmitClaimState> {
  SubmitClaimBloc(this._submit) : super(const SubmitClaimState()) {
    on<SubmitClaimRequested>(_onRequested);
  }

  final SubmitClaimUseCase _submit;

  Future<void> _onRequested(
    SubmitClaimRequested event,
    Emitter<SubmitClaimState> emit,
  ) async {
    final Either<Failure, void> result = await _submit(event.placeId);
    result.fold((Failure failure) {}, (void _) {
      emit(const SubmitClaimState(isSent: true));
    });
  }
}
