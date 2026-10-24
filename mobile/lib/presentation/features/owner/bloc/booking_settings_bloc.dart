import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/place_booking_settings.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/manage_booking_settings_use_case.dart';

abstract class BookingSettingsEvent {
  const BookingSettingsEvent();
}

class BookingSettingsStarted extends BookingSettingsEvent {
  const BookingSettingsStarted(this.placeId);

  final String placeId;
}

class BookingOptionsSubmitted extends BookingSettingsEvent {
  const BookingOptionsSubmitted({
    required this.placeId,
    required this.accepting,
    required this.maxParty,
    required this.minimumNoticeMinutes,
  });

  final String placeId;
  final bool accepting;
  final int maxParty;
  final int minimumNoticeMinutes;
}

class ReplyHourSubmitted extends BookingSettingsEvent {
  const ReplyHourSubmitted({
    required this.placeId,
    required this.weekday,
    required this.opens,
    required this.closes,
  });

  final String placeId;
  final int weekday;
  final String opens;
  final String closes;
}

class ReplyHourRemoved extends BookingSettingsEvent {
  const ReplyHourRemoved({required this.placeId, required this.id});

  final String placeId;
  final int id;
}

class ClosureSubmitted extends BookingSettingsEvent {
  const ClosureSubmitted({
    required this.placeId,
    required this.startsAt,
    required this.endsAt,
    this.reason,
  });

  final String placeId;
  final DateTime startsAt;
  final DateTime endsAt;
  final String? reason;
}

class ClosureRemoved extends BookingSettingsEvent {
  const ClosureRemoved({required this.placeId, required this.id});

  final String placeId;
  final int id;
}

class BookingSettingsState {
  const BookingSettingsState({this.settings, this.result});

  final PlaceBookingSettings? settings;
  final String? result;
}

@injectable
class BookingSettingsBloc
    extends Bloc<BookingSettingsEvent, BookingSettingsState> {
  BookingSettingsBloc(this._manage) : super(const BookingSettingsState()) {
    on<BookingSettingsStarted>(_onStarted);
    on<BookingOptionsSubmitted>(_onOptions);
    on<ReplyHourSubmitted>(_onReplyHour);
    on<ReplyHourRemoved>(_onReplyRemoved);
    on<ClosureSubmitted>(_onClosure);
    on<ClosureRemoved>(_onClosureRemoved);
  }

  final ManageBookingSettingsUseCase _manage;

  Future<void> _onStarted(
    BookingSettingsStarted event,
    Emitter<BookingSettingsState> emit,
  ) async {
    await _reload(event.placeId, emit, result: state.result);
  }

  Future<void> _onOptions(
    BookingOptionsSubmitted event,
    Emitter<BookingSettingsState> emit,
  ) async {
    final Either<Failure, void> result = await _manage.saveOptions(
      placeId: event.placeId,
      accepting: event.accepting,
      maxParty: event.maxParty,
      minimumNoticeMinutes: event.minimumNoticeMinutes,
    );
    await _afterWrite(event.placeId, result, emit);
  }

  Future<void> _onReplyHour(
    ReplyHourSubmitted event,
    Emitter<BookingSettingsState> emit,
  ) async {
    final Either<Failure, void> result = await _manage.addReplyHour(
      placeId: event.placeId,
      weekday: event.weekday,
      opens: event.opens,
      closes: event.closes,
    );
    await _afterWrite(event.placeId, result, emit);
  }

  Future<void> _onReplyRemoved(
    ReplyHourRemoved event,
    Emitter<BookingSettingsState> emit,
  ) async {
    final Either<Failure, void> result = await _manage.removeReplyHour(
      event.id,
    );
    await _afterWrite(event.placeId, result, emit);
  }

  Future<void> _onClosure(
    ClosureSubmitted event,
    Emitter<BookingSettingsState> emit,
  ) async {
    final Either<Failure, void> result = await _manage.addClosure(
      placeId: event.placeId,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      reason: event.reason,
    );
    await _afterWrite(event.placeId, result, emit);
  }

  Future<void> _onClosureRemoved(
    ClosureRemoved event,
    Emitter<BookingSettingsState> emit,
  ) async {
    final Either<Failure, void> result = await _manage.removeClosure(event.id);
    await _afterWrite(event.placeId, result, emit);
  }

  Future<void> _afterWrite(
    String placeId,
    Either<Failure, void> result,
    Emitter<BookingSettingsState> emit,
  ) async {
    if (result.isLeft()) {
      emit(
        BookingSettingsState(
          settings: state.settings,
          result: result.fold(
            (Failure failure) => failure.message,
            (_) => null,
          ),
        ),
      );
      return;
    }
    await _reload(placeId, emit, result: 'saved');
  }

  Future<void> _reload(
    String placeId,
    Emitter<BookingSettingsState> emit, {
    String? result,
  }) async {
    final Either<Failure, PlaceBookingSettings> loaded = await _manage.load(
      placeId,
    );
    loaded.fold((Failure failure) {}, (PlaceBookingSettings settings) {
      emit(BookingSettingsState(settings: settings, result: result));
    });
  }
}
