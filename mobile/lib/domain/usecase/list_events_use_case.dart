import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/event_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class ListEventsUseCase {
  ListEventsUseCase(this._repository);

  final EventRepository _repository;

  Future<Either<Failure, List<Event>>> call() => _repository.list();
}
