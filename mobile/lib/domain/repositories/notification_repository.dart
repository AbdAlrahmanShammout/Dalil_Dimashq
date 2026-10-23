import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/app_notification.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class NotificationRepository {
  Future<Either<Failure, List<AppNotification>>> list();

  Future<Either<Failure, void>> markRead(int id, DateTime at);
}
