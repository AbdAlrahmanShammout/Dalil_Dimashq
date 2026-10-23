import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/site_contact.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class SiteContactRepository {
  Future<Either<Failure, List<SiteContact>>> load();
}
