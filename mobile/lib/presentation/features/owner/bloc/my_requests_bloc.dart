import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/list_change_requests_use_case.dart';

abstract class MyRequestsEvent {
  const MyRequestsEvent();
}

class MyRequestsStarted extends MyRequestsEvent {
  const MyRequestsStarted(this.placeId);

  final String placeId;
}

class MyRequestsState {
  const MyRequestsState({this.requests = const <PlaceChangeRequest>[]});

  final List<PlaceChangeRequest> requests;
}

@injectable
class MyRequestsBloc extends Bloc<MyRequestsEvent, MyRequestsState> {
  MyRequestsBloc(this._list) : super(const MyRequestsState()) {
    on<MyRequestsStarted>(_onStarted);
  }

  final ListChangeRequestsUseCase _list;

  Future<void> _onStarted(
    MyRequestsStarted event,
    Emitter<MyRequestsState> emit,
  ) async {
    final Either<Failure, List<PlaceChangeRequest>> result = await _list(
      event.placeId,
    );
    result.fold((Failure failure) {}, (List<PlaceChangeRequest> requests) {
      emit(MyRequestsState(requests: requests));
    });
  }
}
