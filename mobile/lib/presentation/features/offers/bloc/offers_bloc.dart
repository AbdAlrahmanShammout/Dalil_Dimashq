import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/domain/usecase/list_offers_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

class OffersState {
  const OffersState({
    this.offers = const <PlaceOffer>[],
    this.isLoading = false,
    this.errorMessage,
  });

  final List<PlaceOffer> offers;
  final bool isLoading;
  final String? errorMessage;

  OffersState copyWith({
    List<PlaceOffer>? offers,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return OffersState(
      offers: offers ?? this.offers,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}

class OffersStarted {
  const OffersStarted(this.now);

  final DateTime now;
}

@injectable
class OffersBloc extends Bloc<OffersStarted, OffersState> {
  OffersBloc(this._listOffers) : super(const OffersState()) {
    on<OffersStarted>(_onStarted);
  }

  final ListOffersUseCase _listOffers;

  Future<void> _onStarted(OffersStarted event, Emitter<OffersState> emit) async {
    emit(state.copyWith(isLoading: true, clearError: true));
    final result = await _listOffers();
    result.fold(
      (failure) => emit(
        state.copyWith(isLoading: false, errorMessage: failure.message),
      ),
      (offers) => emit(
        state.copyWith(
          isLoading: false,
          offers: currentOffers(offers, event.now),
          clearError: true,
        ),
      ),
    );
  }
}
