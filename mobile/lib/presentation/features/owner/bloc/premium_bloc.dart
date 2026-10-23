import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_premium_use_case.dart';

abstract class PremiumEvent {
  const PremiumEvent();
}

class PremiumStarted extends PremiumEvent {
  const PremiumStarted(this.now);

  final DateTime now;
}

class PremiumState {
  const PremiumState({this.status = const PremiumStatus(isActive: false, pendingRequests: 0)});

  final PremiumStatus status;
}

@injectable
class PremiumBloc extends Bloc<PremiumEvent, PremiumState> {
  PremiumBloc(this._load) : super(const PremiumState()) {
    on<PremiumStarted>(_onStarted);
  }

  final LoadPremiumUseCase _load;

  Future<void> _onStarted(PremiumStarted event, Emitter<PremiumState> emit) async {
    final Either<Failure, PremiumStatus> result = await _load(event.now);
    result.fold((Failure failure) {}, (PremiumStatus status) {
      emit(PremiumState(status: status));
    });
  }
}
