import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/legal_document.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/accept_legal_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_pending_legal_use_case.dart';
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_event.dart';
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_state.dart';

@injectable
class LegalBloc extends Bloc<LegalEvent, LegalState> {
  LegalBloc(this._loadPending, this._accept) : super(const LegalState()) {
    on<LegalStarted>(_onStarted);
    on<LegalAccepted>(_onAccepted);
  }

  final LoadPendingLegalUseCase _loadPending;
  final AcceptLegalUseCase _accept;

  Future<void> _onStarted(LegalStarted event, Emitter<LegalState> emit) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    final Either<Failure, List<LegalDocument>> result = await _loadPending();
    result.fold(
      (Failure failure) => emit(
        state.copyWith(isLoading: false, errorCode: failure.message),
      ),
      (List<LegalDocument> documents) => emit(
        LegalState(documents: documents),
      ),
    );
  }

  Future<void> _onAccepted(
    LegalAccepted event,
    Emitter<LegalState> emit,
  ) async {
    final Either<Failure, void> result = await _accept(event.documentId);
    final bool accepted = result.fold((Failure failure) {
      emit(state.copyWith(errorCode: failure.message));
      return false;
    }, (_) => true);
    if (accepted) {
      add(const LegalStarted());
    }
  }
}
