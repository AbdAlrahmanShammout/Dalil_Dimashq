import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/claim_place_use_case.dart';

abstract class ClaimPlaceEvent {
  const ClaimPlaceEvent();
}

class ClaimPlaceSubmitted extends ClaimPlaceEvent {
  const ClaimPlaceSubmitted({required this.placeId, required this.code});

  final String placeId;
  final String code;
}

class ClaimPlaceState {
  const ClaimPlaceState({this.isLinked = false, this.errorCode});

  final bool isLinked;
  final String? errorCode;
}

@injectable
class ClaimPlaceBloc extends Bloc<ClaimPlaceEvent, ClaimPlaceState> {
  ClaimPlaceBloc(this._claim) : super(const ClaimPlaceState()) {
    on<ClaimPlaceSubmitted>(_onSubmitted);
  }

  final ClaimPlaceUseCase _claim;

  Future<void> _onSubmitted(
    ClaimPlaceSubmitted event,
    Emitter<ClaimPlaceState> emit,
  ) async {
    final Either<Failure, bool> result = await _claim(
      placeId: event.placeId,
      code: event.code,
    );
    result.fold(
      (Failure failure) => emit(ClaimPlaceState(errorCode: failure.message)),
      (bool linked) => emit(
        ClaimPlaceState(
          isLinked: linked,
          errorCode: linked ? null : 'invalid_code',
        ),
      ),
    );
  }
}
