import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/pick_place_photo_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/upload_place_photo_use_case.dart';

abstract class PlacePhotoEvent {
  const PlacePhotoEvent();
}

class PlacePhotoStarted extends PlacePhotoEvent {
  const PlacePhotoStarted(this.isPremium);

  final bool isPremium;
}

class PlacePhotoPickRequested extends PlacePhotoEvent {
  const PlacePhotoPickRequested({required this.placeId, required this.origin});

  final String placeId;
  final PhotoOrigin origin;
}

class PlacePhotoState {
  const PlacePhotoState({this.isPremium = false, this.photo});

  final bool isPremium;
  final PickedPhoto? photo;
}

@injectable
class PlacePhotoBloc extends Bloc<PlacePhotoEvent, PlacePhotoState> {
  PlacePhotoBloc(this._pick, this._upload) : super(const PlacePhotoState()) {
    on<PlacePhotoStarted>((PlacePhotoStarted event, Emitter<PlacePhotoState> emit) {
      emit(PlacePhotoState(isPremium: event.isPremium));
    });
    on<PlacePhotoPickRequested>(_onPick);
  }

  final PickPlacePhotoUseCase _pick;
  final UploadPlacePhotoUseCase _upload;

  Future<void> _onPick(
    PlacePhotoPickRequested event,
    Emitter<PlacePhotoState> emit,
  ) async {
    final Either<Failure, PickedPhoto?> result = await _pick(event.origin);
    if (result.isLeft()) {
      return;
    }
    final PickedPhoto? photo = result.getOrElse(() => null);
    if (photo != null) {
      await _upload(placeId: event.placeId, photo: photo);
    }
    emit(PlacePhotoState(isPremium: state.isPremium, photo: photo));
  }
}
