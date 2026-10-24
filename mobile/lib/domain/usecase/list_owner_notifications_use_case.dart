import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';
import 'package:dalil_dimashq/domain/services/owner_notification_kinds.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListOwnerNotificationsUseCase {
  ListOwnerNotificationsUseCase(this._repository);

  final NotificationRepository _repository;

  Future<Either<Failure, List<AppNotification>>> call() async {
    final Either<Failure, List<AppNotification>> result = await _repository
        .list();
    return result.map(
      (List<AppNotification> items) => items
          .where((AppNotification item) => isOwnerNotification(item.kind))
          .toList(growable: false),
    );
  }
}
