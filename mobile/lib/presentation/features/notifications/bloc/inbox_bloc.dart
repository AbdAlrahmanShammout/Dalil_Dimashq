import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_notifications_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/open_notification_use_case.dart';

abstract class InboxEvent {
  const InboxEvent();
}

class InboxStarted extends InboxEvent {
  const InboxStarted();
}

class InboxTapped extends InboxEvent {
  const InboxTapped(this.notification);

  final AppNotification notification;
}

class InboxState {
  const InboxState({
    this.notifications = const <AppNotification>[],
    this.openedBooking,
  });

  final List<AppNotification> notifications;
  final BookingSummary? openedBooking;
}

@injectable
class InboxBloc extends Bloc<InboxEvent, InboxState> {
  InboxBloc(this._list, this._open) : super(const InboxState()) {
    on<InboxStarted>(_onStarted);
    on<InboxTapped>(_onTapped);
  }

  final ListNotificationsUseCase _list;
  final OpenNotificationUseCase _open;

  Future<void> _onStarted(
    InboxStarted event,
    Emitter<InboxState> emit,
  ) async {
    final Either<Failure, List<AppNotification>> result = await _list();
    result.fold((Failure failure) {}, (List<AppNotification> notifications) {
      emit(InboxState(notifications: notifications));
    });
  }

  Future<void> _onTapped(
    InboxTapped event,
    Emitter<InboxState> emit,
  ) async {
    final int? bookingId = event.notification.bookingId;
    if (bookingId == null) {
      return;
    }
    final Either<Failure, BookingSummary> result = await _open(
      notificationId: event.notification.id,
      bookingId: bookingId,
    );
    result.fold((Failure failure) {}, (BookingSummary booking) {
      emit(
        InboxState(
          notifications: state.notifications,
          openedBooking: booking,
        ),
      );
    });
  }
}
