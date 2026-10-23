import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/place_immediate_fields.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/save_immediate_fields_use_case.dart';

abstract class ImmediateFieldsEvent {
  const ImmediateFieldsEvent();
}

class ImmediateFieldsSaved extends ImmediateFieldsEvent {
  const ImmediateFieldsSaved({required this.placeId, required this.fields});

  final String placeId;
  final PlaceImmediateFields fields;
}

class ImmediateFieldsState {
  const ImmediateFieldsState({this.isSaved = false, this.errorCode});

  final bool isSaved;
  final String? errorCode;
}

@injectable
class ImmediateFieldsBloc
    extends Bloc<ImmediateFieldsEvent, ImmediateFieldsState> {
  ImmediateFieldsBloc(this._save) : super(const ImmediateFieldsState()) {
    on<ImmediateFieldsSaved>(_onSaved);
  }

  final SaveImmediateFieldsUseCase _save;

  Future<void> _onSaved(
    ImmediateFieldsSaved event,
    Emitter<ImmediateFieldsState> emit,
  ) async {
    final Either<Failure, void> result = await _save(
      placeId: event.placeId,
      fields: event.fields,
    );
    result.fold(
      (Failure failure) => emit(ImmediateFieldsState(errorCode: failure.message)),
      (void _) => emit(const ImmediateFieldsState(isSaved: true)),
    );
  }
}
