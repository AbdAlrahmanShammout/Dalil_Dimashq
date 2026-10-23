import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/contact_message.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/send_contact_message_use_case.dart';

abstract class ContactEvent {
  const ContactEvent();
}

class ContactSubmitted extends ContactEvent {
  const ContactSubmitted(this.message);

  final ContactMessage message;
}

class ContactState {
  const ContactState({this.isSent = false, this.errorCode});

  final bool isSent;
  final String? errorCode;
}

@injectable
class ContactBloc extends Bloc<ContactEvent, ContactState> {
  ContactBloc(this._send) : super(const ContactState()) {
    on<ContactSubmitted>(_onSubmitted);
  }

  final SendContactMessageUseCase _send;

  Future<void> _onSubmitted(
    ContactSubmitted event,
    Emitter<ContactState> emit,
  ) async {
    final Either<Failure, void> result = await _send(event.message);
    result.fold(
      (Failure failure) => emit(ContactState(errorCode: failure.message)),
      (_) => emit(const ContactState(isSent: true)),
    );
  }
}
