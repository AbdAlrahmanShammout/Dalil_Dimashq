import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/contact_message.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class ContactRepository {
  Future<Either<Failure, void>> send(ContactMessage message);
}
