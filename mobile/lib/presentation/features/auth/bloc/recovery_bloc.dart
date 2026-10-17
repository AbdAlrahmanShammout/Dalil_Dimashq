import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/recover_password_use_case.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_event.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_state.dart';

@injectable
class RecoveryBloc extends Bloc<RecoveryEvent, RecoveryState> {
  RecoveryBloc(this._recover) : super(const RecoveryState()) {
    on<RecoverySubmitted>(_onSubmitted);
  }

  final RecoverPasswordUseCase _recover;

  Future<void> _onSubmitted(
    RecoverySubmitted event,
    Emitter<RecoveryState> emit,
  ) async {
    emit(const RecoveryState(status: RecoveryStatus.submitting));
    final Either<Failure, void> result = await _recover(event.email);
    result.fold(
      (_) => emit(const RecoveryState(status: RecoveryStatus.failure)),
      (_) => emit(const RecoveryState(status: RecoveryStatus.success)),
    );
  }
}
