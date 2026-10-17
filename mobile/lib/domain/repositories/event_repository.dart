import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class EventRepository {
  Future<Either<Failure, List<Event>>> list();
}
