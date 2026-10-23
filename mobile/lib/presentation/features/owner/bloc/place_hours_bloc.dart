import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/opening_period.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_place_hours_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_place_hours_use_case.dart';

abstract class PlaceHoursEvent {
  const PlaceHoursEvent();
}

class PlaceHoursStarted extends PlaceHoursEvent {
  const PlaceHoursStarted(this.placeId);

  final String placeId;
}

class PlaceHoursPeriodAdded extends PlaceHoursEvent {
  const PlaceHoursPeriodAdded(this.weekday);

  final int weekday;
}

class PlaceHoursSubmitted extends PlaceHoursEvent {
  const PlaceHoursSubmitted(this.placeId);

  final String placeId;
}

class PlaceHoursState {
  const PlaceHoursState({this.week = const PlaceWeek(), this.result});

  final PlaceWeek week;
  final String? result;
}

@injectable
class PlaceHoursBloc extends Bloc<PlaceHoursEvent, PlaceHoursState> {
  PlaceHoursBloc(this._load, this._save) : super(const PlaceHoursState()) {
    on<PlaceHoursStarted>(_onStarted);
    on<PlaceHoursPeriodAdded>(_onAdded);
    on<PlaceHoursSubmitted>(_onSubmitted);
  }

  final LoadPlaceHoursUseCase _load;
  final SavePlaceHoursUseCase _save;

  Future<void> _onStarted(
    PlaceHoursStarted event,
    Emitter<PlaceHoursState> emit,
  ) async {
    final Either<Failure, PlaceWeek> result = await _load(event.placeId);
    result.fold((Failure failure) {}, (PlaceWeek week) {
      emit(PlaceHoursState(week: week));
    });
  }

  void _onAdded(PlaceHoursPeriodAdded event, Emitter<PlaceHoursState> emit) {
    emit(
      PlaceHoursState(
        week: state.week.add(
          OpeningPeriod(weekday: event.weekday, opens: '09:00', closes: '17:00'),
        ),
      ),
    );
  }

  Future<void> _onSubmitted(
    PlaceHoursSubmitted event,
    Emitter<PlaceHoursState> emit,
  ) async {
    final Either<Failure, String> result = await _save(
      placeId: event.placeId,
      week: state.week,
    );
    result.fold((Failure failure) {}, (String value) {
      emit(PlaceHoursState(week: state.week, result: value));
    });
  }
}
