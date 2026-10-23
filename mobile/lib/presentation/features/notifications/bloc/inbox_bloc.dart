import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_notifications_use_case.dart';

abstract class InboxEvent {
  const InboxEvent();
}

class InboxStarted extends InboxEvent {
  const InboxStarted();
}

class InboxState {
  const InboxState({this.notifications = const <AppNotification>[]});

  final List<AppNotification> notifications;
}

@injectable
class InboxBloc extends Bloc<InboxEvent, InboxState> {
  InboxBloc(this._list) : super(const InboxState()) {
    on<InboxStarted>(_onStarted);
  }

  final ListNotificationsUseCase _list;

  Future<void> _onStarted(
    InboxStarted event,
    Emitter<InboxState> emit,
  ) async {
    final Either<Failure, List<AppNotification>> result = await _list();
    result.fold((Failure failure) {}, (List<AppNotification> notifications) {
      emit(InboxState(notifications: notifications));
    });
  }
}
