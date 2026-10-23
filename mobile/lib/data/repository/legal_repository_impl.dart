import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/profile_api_client.dart';
import 'package:dalil_dimashq/data/dto/legal_document_dto.dart';
import 'package:dalil_dimashq/domain/entities/legal_document.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/legal_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: LegalRepository)
class LegalRepositoryImpl implements LegalRepository {
  LegalRepositoryImpl(this._client);

  final ProfileApiClient _client;

  @override
  Future<Either<Failure, List<LegalDocument>>> pending() async {
    try {
      final List<LegalDocumentDto> rows = await _client.pendingLegal(
        <String, dynamic>{},
      );
      return Right(
        rows.map((LegalDocumentDto row) => row.toEntity()).toList(),
      );
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }

  @override
  Future<Either<Failure, void>> accept(int documentId) async {
    try {
      await _client.acceptLegal(<String, dynamic>{
        'p_document_id': documentId,
      });
      return const Right(null);
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
