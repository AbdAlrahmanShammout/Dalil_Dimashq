import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_owner_notifications_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/open_notification_use_case.dart';

abstract class OwnerInboxEvent {
  const OwnerInboxEvent();
}

class OwnerInboxStarted extends OwnerInboxEvent {
  const OwnerInboxStarted();
}

class OwnerInboxTapped extends OwnerInboxEvent {
  const OwnerInboxTapped(this.notification);

  final AppNotification notification;
}

class OwnerInboxState {
  const OwnerInboxState({
    this.notifications = const <AppNotification>[],
    this.openedBooking,
  });

  final List<AppNotification> notifications;
  final BookingSummary? openedBooking;
}

@injectable
class OwnerInboxBloc extends Bloc<OwnerInboxEvent, OwnerInboxState> {
  OwnerInboxBloc(this._list, this._open) : super(const OwnerInboxState()) {
    on<OwnerInboxStarted>(_onStarted);
    on<OwnerInboxTapped>(_onTapped);
  }

  final ListOwnerNotificationsUseCase _list;
  final OpenNotificationUseCase _open;

  Future<void> _onStarted(
    OwnerInboxStarted event,
    Emitter<OwnerInboxState> emit,
  ) async {
    final Either<Failure, List<AppNotification>> result = await _list();
    result.fold((Failure failure) {}, (List<AppNotification> notifications) {
      emit(OwnerInboxState(notifications: notifications));
    });
  }

  Future<void> _onTapped(
    OwnerInboxTapped event,
    Emitter<OwnerInboxState> emit,
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
        OwnerInboxState(
          notifications: state.notifications,
          openedBooking: booking,
        ),
      );
    });
  }
}
