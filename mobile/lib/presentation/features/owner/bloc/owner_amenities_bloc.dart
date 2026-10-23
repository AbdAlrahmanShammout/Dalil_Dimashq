import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/domain/entities/owner_amenities.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_owner_amenities_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/toggle_amenity_use_case.dart';

abstract class OwnerAmenitiesEvent {
  const OwnerAmenitiesEvent();
}

class OwnerAmenitiesStarted extends OwnerAmenitiesEvent {
  const OwnerAmenitiesStarted(this.placeId);

  final String placeId;
}

class OwnerAmenityToggled extends OwnerAmenitiesEvent {
  const OwnerAmenityToggled({required this.placeId, required this.code});

  final String placeId;
  final String code;
}

class OwnerAmenitiesState {
  const OwnerAmenitiesState({
    this.amenities = const OwnerAmenities(
      catalog: <Amenity>[],
      selected: <String>[],
    ),
  });

  final OwnerAmenities amenities;
}

@injectable
class OwnerAmenitiesBloc extends Bloc<OwnerAmenitiesEvent, OwnerAmenitiesState> {
  OwnerAmenitiesBloc(this._load, this._toggle) : super(const OwnerAmenitiesState()) {
    on<OwnerAmenitiesStarted>(_onStarted);
    on<OwnerAmenityToggled>(_onToggled);
  }

  final LoadOwnerAmenitiesUseCase _load;
  final ToggleAmenityUseCase _toggle;

  Future<void> _onStarted(
    OwnerAmenitiesStarted event,
    Emitter<OwnerAmenitiesState> emit,
  ) async {
    final Either<Failure, OwnerAmenities> result = await _load(event.placeId);
    result.fold((Failure failure) {}, (OwnerAmenities amenities) {
      emit(OwnerAmenitiesState(amenities: amenities));
    });
  }

  Future<void> _onToggled(
    OwnerAmenityToggled event,
    Emitter<OwnerAmenitiesState> emit,
  ) async {
    final bool isSelected = state.amenities.has(event.code);
    final Either<Failure, void> result = await _toggle(
      placeId: event.placeId,
      code: event.code,
      isSelected: isSelected,
    );
    if (result.isLeft()) {
      return;
    }
    final List<String> selected = List<String>.from(state.amenities.selected);
    if (isSelected) {
      selected.remove(event.code);
    } else {
      selected.add(event.code);
    }
    emit(
      OwnerAmenitiesState(
        amenities: OwnerAmenities(
          catalog: state.amenities.catalog,
          selected: selected,
        ),
      ),
    );
  }
}
