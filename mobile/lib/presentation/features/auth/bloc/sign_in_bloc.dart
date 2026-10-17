import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/sign_in_use_case.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_event.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_state.dart';

@injectable
class SignInBloc extends Bloc<SignInEvent, SignInState> {
  SignInBloc(this._signIn) : super(const SignInState()) {
    on<SignInSubmitted>(_onSubmitted);
  }

  final SignInUseCase _signIn;

  Future<void> _onSubmitted(
    SignInSubmitted event,
    Emitter<SignInState> emit,
  ) async {
    emit(const SignInState(status: SignInStatus.submitting));
    final Either<Failure, void> result = await _signIn(event.request);
    result.fold(
      (Failure failure) =>
          emit(SignInState(status: SignInStatus.failure, failure: failure)),
      (_) => emit(const SignInState(status: SignInStatus.success)),
    );
  }
}
