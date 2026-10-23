import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/suggestion_api_client.dart';
import 'package:dalil_dimashq/domain/entities/suggestion.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/suggestion_repository.dart';

@LazySingleton(as: SuggestionRepository)
class SuggestionRepositoryImpl implements SuggestionRepository {
  SuggestionRepositoryImpl(this._client);

  final SuggestionApiClient _client;

  @override
  Future<Either<Failure, void>> send(
    Suggestion suggestion,
    String kind,
  ) async {
    try {
      await _client.create(<String, dynamic>{
        'name': suggestion.name,
        'contact': suggestion.contact,
        'message': suggestion.message,
        'kind': kind,
        if (suggestion.placeId != null && suggestion.placeId!.isNotEmpty)
          'place_id': suggestion.placeId,
      });
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      return Left<Failure, void>(mapSupabaseException(error));
    }
  }
}
