import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_event.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_state.dart';

@injectable
class BookingDraftBloc extends Bloc<BookingDraftEvent, BookingDraftState> {
  BookingDraftBloc(this._loadProfile) : super(const BookingDraftState()) {
    on<BookingDraftStarted>(_onStarted);
  }

  final LoadProfileUseCase _loadProfile;

  Future<void> _onStarted(
    BookingDraftStarted event,
    Emitter<BookingDraftState> emit,
  ) async {
    final Either<Failure, UserProfile> result = await _loadProfile();
    result.fold((Failure failure) {}, (UserProfile profile) {
      emit(
        BookingDraftState(
          displayName: profile.displayName,
          phone: profile.phone,
          placeId: event.placeId,
        ),
      );
    });
  }
}
