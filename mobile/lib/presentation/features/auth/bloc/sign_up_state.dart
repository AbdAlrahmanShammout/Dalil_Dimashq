import 'package:dalil_dimashq/domain/failures/failure.dart';

enum SignUpStatus { idle, submitting, success, failure }

class SignUpState {
  const SignUpState({this.status = SignUpStatus.idle, this.failure});

  final SignUpStatus status;
  final Failure? failure;

  SignUpState copyWith({required SignUpStatus status, Failure? failure}) {
    return SignUpState(status: status, failure: failure);
  }
}
