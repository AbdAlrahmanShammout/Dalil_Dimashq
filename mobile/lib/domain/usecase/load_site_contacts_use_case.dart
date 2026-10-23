import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/site_contact.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/site_contact_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class LoadSiteContactsUseCase {
  LoadSiteContactsUseCase(this._repository);

  final SiteContactRepository _repository;

  Future<Either<Failure, List<SiteContact>>> call() {
    return _repository.load();
  }
}
