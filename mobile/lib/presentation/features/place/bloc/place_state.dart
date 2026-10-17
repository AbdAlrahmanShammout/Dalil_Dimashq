import 'package:dalil_dimashq/domain/entities/place_detail.dart';

class PlaceState {
  const PlaceState({this.place, this.isLoading = false, this.errorMessage});

  final PlaceDetail? place;
  final bool isLoading;
  final String? errorMessage;

  PlaceState copyWith({
    PlaceDetail? place,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return PlaceState(
      place: place ?? this.place,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}
