import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/contact_message.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/contact_repository.dart';
import 'package:dalil_dimashq/domain/services/contact_rate_limit.dart';
import 'package:injectable/injectable.dart';

abstract class ContactHistory {
  List<DateTime> sentAt();

  Future<void> record(DateTime at);
}

@injectable
class SendContactMessageUseCase {
  SendContactMessageUseCase(this._repository, this._history);

  final ContactRepository _repository;
  final ContactHistory _history;

  Future<Either<Failure, void>> call(
    ContactMessage message, {
    DateTime? now,
  }) async {
    final int bytes = utf8.encode(jsonEncode(message.toJson())).length;
    if (bytes > ContactMessage.maxBytes) {
      return const Left<Failure, void>(ValidationFailure('too_large'));
    }
    final DateTime clock = now ?? DateTime.now();
    if (isContactRateLimited(sentAt: _history.sentAt(), now: clock)) {
      return const Left<Failure, void>(ValidationFailure('rate_limited'));
    }
    final Either<Failure, void> result = await _repository.send(message);
    if (result.isLeft()) {
      return result;
    }
    await _history.record(clock);
    return const Right<Failure, void>(null);
  }
}
