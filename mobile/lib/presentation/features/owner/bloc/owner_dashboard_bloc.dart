import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_owner_dashboard_use_case.dart';

abstract class OwnerDashboardEvent {
  const OwnerDashboardEvent();
}

class OwnerDashboardStarted extends OwnerDashboardEvent {
  const OwnerDashboardStarted(this.placeId);

  final String placeId;
}

class OwnerDashboardState {
  const OwnerDashboardState({this.dashboard});

  final OwnerDashboard? dashboard;
}

@injectable
class OwnerDashboardBloc extends Bloc<OwnerDashboardEvent, OwnerDashboardState> {
  OwnerDashboardBloc(this._load) : super(const OwnerDashboardState()) {
    on<OwnerDashboardStarted>(_onStarted);
  }

  final LoadOwnerDashboardUseCase _load;

  Future<void> _onStarted(
    OwnerDashboardStarted event,
    Emitter<OwnerDashboardState> emit,
  ) async {
    final Either<Failure, OwnerDashboard> result = await _load(event.placeId);
    result.fold((Failure failure) {}, (OwnerDashboard dashboard) {
      emit(OwnerDashboardState(dashboard: dashboard));
    });
  }
}
