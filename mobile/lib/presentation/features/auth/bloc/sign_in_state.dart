import 'package:dalil_dimashq/domain/failures/failure.dart';

enum SignInStatus { idle, submitting, success, failure }

class SignInState {
  const SignInState({this.status = SignInStatus.idle, this.failure});

  final SignInStatus status;
  final Failure? failure;

  SignInState copyWith({required SignInStatus status, Failure? failure}) {
    return SignInState(status: status, failure: failure);
  }
}
