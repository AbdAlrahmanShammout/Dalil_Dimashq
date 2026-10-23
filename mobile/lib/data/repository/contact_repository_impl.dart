import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dalil_dimashq/data/datasource/remote/contact_api_client.dart';
import 'package:dalil_dimashq/domain/entities/contact_message.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/contact_repository.dart';
import 'package:dalil_dimashq/domain/usecase/send_contact_message_use_case.dart';

const String contactSentAtKey = 'contact_sent_at';

@LazySingleton(as: ContactRepository)
class ContactRepositoryImpl implements ContactRepository {
  ContactRepositoryImpl(this._client);

  final ContactApiClient _client;

  @override
  Future<Either<Failure, void>> send(ContactMessage message) async {
    try {
      await _client.send(message.toJson());
      return const Right<Failure, void>(null);
    } on DioException catch (error) {
      final int? status = error.response?.statusCode;
      if (status == 413) {
        return const Left<Failure, void>(ValidationFailure('too_large'));
      }
      if (status == 429) {
        return const Left<Failure, void>(ValidationFailure('rate_limited'));
      }
      return Left<Failure, void>(ServerFailure('contact_failed'));
    }
  }
}

@LazySingleton(as: ContactHistory)
class ContactHistoryImpl implements ContactHistory {
  ContactHistoryImpl(this._preferences);

  final SharedPreferences _preferences;

  @override
  List<DateTime> sentAt() {
    final List<String> stored =
        _preferences.getStringList(contactSentAtKey) ?? <String>[];
    return stored
        .map((String value) => DateTime.parse(value))
        .toList(growable: false);
  }

  @override
  Future<void> record(DateTime at) async {
    final List<String> stored = <String>[
      ..._preferences.getStringList(contactSentAtKey) ?? <String>[],
      at.toUtc().toIso8601String(),
    ];
    await _preferences.setStringList(contactSentAtKey, stored);
  }
}
