import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/sign_out_use_case.dart';

abstract class SignOutEvent {
  const SignOutEvent();
}

class SignOutRequested extends SignOutEvent {
  const SignOutRequested();
}

class SignOutState {
  const SignOutState({this.isSignedOut = false, this.errorCode});

  final bool isSignedOut;
  final String? errorCode;
}

@injectable
class SignOutBloc extends Bloc<SignOutEvent, SignOutState> {
  SignOutBloc(this._signOut) : super(const SignOutState()) {
    on<SignOutRequested>(_onRequested);
  }

  final SignOutUseCase _signOut;

  Future<void> _onRequested(
    SignOutRequested event,
    Emitter<SignOutState> emit,
  ) async {
    final Either<Failure, void> result = await _signOut();
    result.fold(
      (Failure failure) => emit(SignOutState(errorCode: failure.message)),
      (_) => emit(const SignOutState(isSignedOut: true)),
    );
  }
}
