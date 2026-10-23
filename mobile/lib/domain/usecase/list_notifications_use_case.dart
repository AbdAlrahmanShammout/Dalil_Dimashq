import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListNotificationsUseCase {
  ListNotificationsUseCase(this._repository);

  final NotificationRepository _repository;

  Future<Either<Failure, List<AppNotification>>> call() => _repository.list();
}
