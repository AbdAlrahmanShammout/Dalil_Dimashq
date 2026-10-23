import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/complete_profile_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/request_profile_change_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/update_profile_phone_use_case.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_event.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_state.dart';

@injectable
class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  ProfileBloc(
    this._loadProfile,
    this._completeProfile,
    this._updatePhone,
    this._requestChange,
  ) : super(const ProfileState()) {
    on<ProfileStarted>(_onStarted);
    on<ProfileSubmitted>(_onSubmitted);
  }

  final LoadProfileUseCase _loadProfile;
  final CompleteProfileUseCase _completeProfile;
  final UpdateProfilePhoneUseCase _updatePhone;
  final RequestProfileChangeUseCase _requestChange;

  Future<void> _onStarted(
    ProfileStarted event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, isSaved: false, clearError: true));
    final Either<Failure, UserProfile> result = await _loadProfile();
    result.fold(
      (Failure failure) => emit(
        state.copyWith(isLoading: false, errorCode: failure.message),
      ),
      (UserProfile profile) => emit(
        ProfileState(profile: profile),
      ),
    );
  }

  Future<void> _onSubmitted(
    ProfileSubmitted event,
    Emitter<ProfileState> emit,
  ) async {
    final int? birthYear = int.tryParse(event.birthYearText.trim());
    if (birthYear == null) {
      emit(
        state.copyWith(
          isSaved: false,
          errorCode: 'birth_year_invalid',
          clearError: false,
        ),
      );
      return;
    }
    final ProfileDraft draft = ProfileDraft(
      firstName: event.firstName.trim(),
      lastName: event.lastName.trim(),
      phone: event.phone.trim(),
      birthYear: birthYear,
      language: event.language,
    );
    if (!state.profile.isComplete) {
      await _emitResult(emit, _completeProfile(draft));
      return;
    }
    final bool phoneChanged = draft.phone != state.profile.phone.trim();
    final bool identityChanged = _identityChanged(state.profile, draft);
    if (!phoneChanged && !identityChanged) {
      emit(state.copyWith(isSaved: false, errorCode: 'nothing_to_change'));
      return;
    }
    if (phoneChanged) {
      final Either<Failure, UserProfile> phoneResult = await _updatePhone(
        phone: draft.phone,
        language: draft.language,
      );
      final UserProfile? saved = phoneResult.fold((Failure failure) {
        emit(state.copyWith(isSaved: false, errorCode: failure.message));
        return null;
      }, (UserProfile profile) => profile);
      if (saved == null) {
        return;
      }
      emit(ProfileState(profile: saved, isSaved: !identityChanged));
    }
    if (identityChanged) {
      if (state.profile.hasPendingChange) {
        emit(state.copyWith(isSaved: false, errorCode: 'request_pending'));
        return;
      }
      await _emitResult(emit, _requestChange(draft));
    }
  }

  bool _identityChanged(UserProfile profile, ProfileDraft draft) {
    return draft.firstName != profile.firstName.trim() ||
        draft.lastName != profile.lastName.trim() ||
        draft.birthYear != profile.birthYear;
  }

  Future<void> _emitResult(
    Emitter<ProfileState> emit,
    Future<Either<Failure, UserProfile>> result,
  ) async {
    final Either<Failure, UserProfile> value = await result;
    value.fold(
      (Failure failure) =>
          emit(state.copyWith(isSaved: false, errorCode: failure.message)),
      (UserProfile profile) => emit(
        ProfileState(profile: profile, isSaved: true),
      ),
    );
  }
}
