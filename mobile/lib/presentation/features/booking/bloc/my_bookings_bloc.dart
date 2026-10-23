import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_bookings_use_case.dart';

abstract class MyBookingsEvent {
  const MyBookingsEvent();
}

class MyBookingsStarted extends MyBookingsEvent {
  const MyBookingsStarted();
}

class MyBookingsState {
  const MyBookingsState({this.bookings = const <BookingSummary>[]});

  final List<BookingSummary> bookings;
}

@injectable
class MyBookingsBloc extends Bloc<MyBookingsEvent, MyBookingsState> {
  MyBookingsBloc(this._list) : super(const MyBookingsState()) {
    on<MyBookingsStarted>(_onStarted);
  }

  final ListBookingsUseCase _list;

  Future<void> _onStarted(
    MyBookingsStarted event,
    Emitter<MyBookingsState> emit,
  ) async {
    final Either<Failure, List<BookingSummary>> result = await _list();
    result.fold((Failure failure) {}, (List<BookingSummary> bookings) {
      emit(MyBookingsState(bookings: bookings));
    });
  }
}
