import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/core/network/supabase_failure_mapper.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/site_contact_dto.dart';
import 'package:dalil_dimashq/domain/entities/site_contact.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/site_contact_repository.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

const Set<String> _visibleContactKeys = <String>{
  'whatsapp',
  'phone',
  'email',
  'facebook',
  'instagram',
};

@LazySingleton(as: SiteContactRepository)
class SiteContactRepositoryImpl implements SiteContactRepository {
  SiteContactRepositoryImpl(this._remote);

  final DirectoryRemoteDataSource _remote;

  @override
  Future<Either<Failure, List<SiteContact>>> load() async {
    try {
      final List<SiteContact> contacts = (await _remote.siteContacts())
          .map((SiteContactDto row) => row.toEntity())
          .where(
            (SiteContact contact) =>
                contact.isVisible &&
                _visibleContactKeys.contains(contact.key.toLowerCase()),
          )
          .toList();
      return Right(contacts);
    } on DioException catch (error) {
      return Left(mapSupabaseException(error));
    }
  }
}
