import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/sign_up_use_case.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_event.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_state.dart';

@injectable
class SignUpBloc extends Bloc<SignUpEvent, SignUpState> {
  SignUpBloc(this._signUp) : super(const SignUpState()) {
    on<SignUpSubmitted>(_onSubmitted);
  }

  final SignUpUseCase _signUp;

  Future<void> _onSubmitted(
    SignUpSubmitted event,
    Emitter<SignUpState> emit,
  ) async {
    emit(const SignUpState(status: SignUpStatus.submitting));
    final Either<Failure, void> result = await _signUp(event.request);
    result.fold(
      (Failure failure) =>
          emit(SignUpState(status: SignUpStatus.failure, failure: failure)),
      (_) => emit(const SignUpState(status: SignUpStatus.success)),
    );
  }
}
