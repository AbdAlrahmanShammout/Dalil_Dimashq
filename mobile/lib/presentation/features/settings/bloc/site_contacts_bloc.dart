import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/site_contact.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_site_contacts_use_case.dart';

abstract class SiteContactsEvent {
  const SiteContactsEvent();
}

class SiteContactsStarted extends SiteContactsEvent {
  const SiteContactsStarted();
}

class SiteContactsState {
  const SiteContactsState({this.contacts = const <SiteContact>[]});

  final List<SiteContact> contacts;
}

@injectable
class SiteContactsBloc extends Bloc<SiteContactsEvent, SiteContactsState> {
  SiteContactsBloc(this._loadContacts) : super(const SiteContactsState()) {
    on<SiteContactsStarted>(_onStarted);
  }

  final LoadSiteContactsUseCase _loadContacts;

  Future<void> _onStarted(
    SiteContactsStarted event,
    Emitter<SiteContactsState> emit,
  ) async {
    final Either<Failure, List<SiteContact>> result = await _loadContacts();
    result.fold((Failure failure) {}, (List<SiteContact> contacts) {
      emit(SiteContactsState(contacts: contacts));
    });
  }
}
