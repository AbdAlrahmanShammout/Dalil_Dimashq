import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';

abstract class SignUpEvent {
  const SignUpEvent();
}

class SignUpSubmitted extends SignUpEvent {
  const SignUpSubmitted(this.request);

  final SignUpRequest request;
}
