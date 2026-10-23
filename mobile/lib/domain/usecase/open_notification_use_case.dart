import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';
import 'package:dalil_dimashq/domain/usecase/load_booking_use_case.dart';
import 'package:injectable/injectable.dart';

@injectable
class OpenNotificationUseCase {
  OpenNotificationUseCase(this._notifications, this._loadBooking);

  final NotificationRepository _notifications;
  final LoadBookingUseCase _loadBooking;

  Future<Either<Failure, BookingSummary>> call({
    required int notificationId,
    required int bookingId,
    DateTime? readAt,
  }) async {
    await _notifications.markRead(notificationId, readAt ?? DateTime.now());
    return _loadBooking(bookingId);
  }
}
