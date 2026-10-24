import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/place_booking_settings.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/booking_settings_repository.dart';
import 'package:injectable/injectable.dart';

final RegExp replyHourTime = RegExp(r'^\d{2}:\d{2}$');

@injectable
class ManageBookingSettingsUseCase {
  ManageBookingSettingsUseCase(this._repository);

  final BookingSettingsRepository _repository;

  Future<Either<Failure, PlaceBookingSettings>> load(String placeId) {
    return _repository.load(placeId);
  }

  Future<Either<Failure, void>> saveOptions({
    required String placeId,
    required bool accepting,
    required int maxParty,
    required int minimumNoticeMinutes,
  }) {
    if (maxParty < 1) {
      return _invalid('max_party');
    }
    if (minimumNoticeMinutes < 0) {
      return _invalid('notice');
    }
    return _repository.saveOptions(
      placeId: placeId,
      accepting: accepting,
      maxParty: maxParty,
      minimumNoticeMinutes: minimumNoticeMinutes,
    );
  }

  Future<Either<Failure, void>> addReplyHour({
    required String placeId,
    required int weekday,
    required String opens,
    required String closes,
  }) {
    if (weekday < 0 ||
        weekday > 6 ||
        !replyHourTime.hasMatch(opens) ||
        !replyHourTime.hasMatch(closes)) {
      return _invalid('reply_hours');
    }
    return _repository.addReplyHour(
      placeId: placeId,
      weekday: weekday,
      opens: opens,
      closes: closes,
    );
  }

  Future<Either<Failure, void>> removeReplyHour(int id) {
    return _repository.removeReplyHour(id);
  }

  Future<Either<Failure, void>> addClosure({
    required String placeId,
    required DateTime startsAt,
    required DateTime endsAt,
    String? reason,
  }) {
    if (!endsAt.isAfter(startsAt)) {
      return _invalid('closure');
    }
    final String? value = reason?.trim();
    return _repository.addClosure(
      placeId: placeId,
      startsAt: startsAt,
      endsAt: endsAt,
      reason: value == null || value.isEmpty ? null : value,
    );
  }

  Future<Either<Failure, void>> removeClosure(int id) {
    return _repository.removeClosure(id);
  }

  Future<Either<Failure, void>> _invalid(String code) {
    return Future<Either<Failure, void>>.value(
      Left<Failure, void>(ValidationFailure(code)),
    );
  }
}
