import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';

abstract class SignInEvent {
  const SignInEvent();
}

class SignInSubmitted extends SignInEvent {
  const SignInSubmitted(this.request);

  final SignInRequest request;
}
