import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/event_dto.dart';
import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/event_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: EventRepository)
class EventRepositoryImpl implements EventRepository {
  EventRepositoryImpl(this._remote);

  final DirectoryRemoteDataSource _remote;

  @override
  Future<Either<Failure, List<Event>>> list() async {
    try {
      final List<Event> events = (await _remote.events())
          .map((EventDto event) => event.toEntity())
          .toList();
      return Right(events);
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
