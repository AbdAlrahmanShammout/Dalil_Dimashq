import 'package:dalil_dimashq/domain/entities/event.dart';
import 'package:dalil_dimashq/domain/usecase/list_events_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

class EventsState {
  const EventsState({
    this.events = const <Event>[],
    this.isLoading = false,
    this.errorMessage,
  });

  final List<Event> events;
  final bool isLoading;
  final String? errorMessage;

  EventsState copyWith({
    List<Event>? events,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return EventsState(
      events: events ?? this.events,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}

class EventsStarted {
  const EventsStarted(this.now);

  final DateTime now;
}

@injectable
class EventsBloc extends Bloc<EventsStarted, EventsState> {
  EventsBloc(this._listEvents) : super(const EventsState()) {
    on<EventsStarted>(_onStarted);
  }

  final ListEventsUseCase _listEvents;

  Future<void> _onStarted(EventsStarted event, Emitter<EventsState> emit) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    final result = await _listEvents();
    result.fold(
      (failure) => emit(
        state.copyWith(isLoading: false, errorMessage: failure.message),
      ),
      (events) => emit(
        state.copyWith(
          isLoading: false,
          events: visibleEvents(events, event.now),
          clearError: true,
        ),
      ),
    );
  }
}
